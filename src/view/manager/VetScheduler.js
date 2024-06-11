import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set, push, update } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VetScheduler.css';

const VetScheduler = () => {
  const [vets, setVets] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cages, setCages] = useState([]);
  const [petInfo, setPetInfo] = useState({
    ownerName: '',
    ownerPhone: '',
    petName: '',
    reason: '',
    cage: ''
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const timeSlots = [
    "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
    "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
    "2:15 PM", "2:30 PM", "2:45 PM", "3:00 PM",
    "3:15 PM", "3:30 PM", "3:45 PM", "4:00 PM",
    "4:15 PM", "4:30 PM", "4:45 PM"
  ];

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');
    const cagesRef = ref(db, 'cages');

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const vetsList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      })).filter(user => user.role === 'veterinarian') : [];
      setVets(vetsList);
    });

    onValue(cagesRef, (snapshot) => {
      const data = snapshot.val();
      const cagesList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      })) : [];
      setCages(cagesList);
    });
  }, []);

  const handleVetSelect = (vetId) => {
    const vet = vets.find(vet => vet.id === vetId);
    setSelectedVet(vet);
    if (vet && selectedDate) {
      fetchAvailableTimeSlots(vet.id, selectedDate);
      fetchBookings(vet.fullname, selectedDate);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedVet) {
      fetchAvailableTimeSlots(selectedVet.id, date);
      fetchBookings(selectedVet.fullname, date);
    }
  };

  const fetchAvailableTimeSlots = (vetId, date) => {
    const db = getDatabase();
    const scheduleRef = ref(db, `users/${vetId}/schedule/${date}`);
    onValue(scheduleRef, (snapshot) => {
      const data = snapshot.val() || {};
      setAvailableTimeSlots(data);
    });
  };

  const fetchBookings = (vetName, date) => {
    const db = getDatabase();
    const bookingsRef = ref(db, 'users');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const vetBookings = Object.values(data)
        .filter(user => user.bookings)
        .flatMap(user => Object.values(user.bookings))
        .filter(booking => booking.vet.name === vetName && booking.date === date)
        .map(booking => ({ time: booking.time, cage: booking.cage }));
      setBookings(vetBookings);
    });
  };

  const checkStatus = (time) => {
    return bookings.some(booking => booking.time === time) ? 'busy' : 'free';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetInfo({ ...petInfo, [name]: value });
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
  };

  const isCageAvailable = (cageId) => {
    return cages.some(cage => cage.id === cageId && cage.status === 'Available');
  };

  const handleBooking = () => {
    if (!selectedVet || !selectedDate || !selectedTimeSlot) {
      toast.error("Please select a veterinarian, date, and time slot first.");
      return;
    }

    if (!isCageAvailable(petInfo.cage)) {
      toast.error('Selected cage is not available!');
      return;
    }

    const newBooking = {
      ...petInfo,
      time: selectedTimeSlot,
      date: selectedDate,
      vet: { name: selectedVet.fullname },
      status: 'confirmed'
    };

    const db = getDatabase();
    const bookingRef = push(ref(db, `users/${selectedVet.id}/bookings`));
    set(bookingRef, newBooking);

    set(ref(db, `users/${selectedVet.id}/schedule/${selectedDate}/${selectedTimeSlot}`), 'busy');

    const cageRef = ref(db, `cages/${petInfo.cage}`);
    update(cageRef, { status: 'Occupied' });

    setBookings([...bookings, { time: selectedTimeSlot, cage: petInfo.cage }]);
    toast.success("Booking successfully added!");

    setSelectedTimeSlot("");
    setPetInfo({
      ownerName: '',
      ownerPhone: '',
      petName: '',
      reason: '',
      cage: ''
    });
  };

  return (
    <div className="vet-scheduler-container">
      <h1>Vet Schedule Management</h1>
      <select onChange={(e) => handleVetSelect(e.target.value)}>
        <option value="">Select Veterinarian</option>
        {vets.map(vet => (
          <option key={vet.id} value={vet.id}>{vet.fullname}</option>
        ))}
      </select>
      <input type="date" onChange={(e) => handleDateChange(e.target.value)} />
      <div className="pet-info-form">
        <h2>Pet and Owner Information</h2>
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={petInfo.ownerName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="ownerPhone"
          placeholder="Owner Phone"
          value={petInfo.ownerPhone}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="petName"
          placeholder="Pet Name"
          value={petInfo.petName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason for Visit"
          value={petInfo.reason}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="cage"
          placeholder="Cage Number"
          value={petInfo.cage}
          onChange={handleInputChange}
        />
        <button onClick={handleBooking}>Book Appointment</button>
      </div>
      <div>
        <h2>Available Time Slots</h2>
        <div className="time-slots">
          {timeSlots.map(time => (
            <button
              key={time}
              className={`${checkStatus(time)} ${selectedTimeSlot === time ? 'selected' : ''}`}
              disabled={checkStatus(time) === 'busy'}
              onClick={() => handleTimeSlotSelect(time)}
            >
              {time} {checkStatus(time) === 'busy' ? "(Busy)" : "(Free)"}
            </button>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VetScheduler;
