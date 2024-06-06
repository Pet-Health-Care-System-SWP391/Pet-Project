import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VetScheduleManagement.css';

const VetScheduleManagement = () => {
  const [vets, setVets] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [schedule, setSchedule] = useState({});
  const [bookings, setBookings] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    reason: ''
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
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const vetsList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      })).filter(user => user.role === 'veterinarian') : [];
      setVets(vetsList);
    });
  }, []);

  const handleVetSelect = (vetId) => {
    const vet = vets.find(vet => vet.id === vetId);
    setSelectedVet(vet);
    if (vet && selectedDate) {
      fetchSchedule(vet.id, selectedDate);
      fetchBookings(vet.username, selectedDate); 
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedVet) {
      fetchSchedule(selectedVet.id, date);
      fetchBookings(selectedVet.username, date); 
    }
  };

  const fetchSchedule = (vetId, date) => {
    const db = getDatabase();
    const scheduleRef = ref(db, `users/${vetId}/schedule/${date}`);
    onValue(scheduleRef, (snapshot) => {
      const data = snapshot.val() || {};
      setSchedule(data);
    });
  };

  const fetchBookings = (username, date) => {
    const db = getDatabase();
    const bookingsRef = ref(db, 'users');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const vetBookings = Object.values(data)
        .filter(user => user.bookings)
        .flatMap(user => Object.values(user.bookings))
        .filter(booking => booking.veterinarian === username && booking.date === date)
        .map(booking => booking.time);
      setBookings(vetBookings);
    });
  };

  const checkStatus = (time) => {
    return bookings.includes(time) ? 'busy' : 'free';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
  };

  const handleBooking = () => {
    if (!selectedVet || !selectedDate || !selectedTimeSlot) {
      toast.error("Please select a veterinarian, date, and time slot first.");
      return;
    }

    const newBooking = {
      ...customerInfo,
      time: selectedTimeSlot,
      date: selectedDate,
      veterinarian: selectedVet.username
    };

    const db = getDatabase();
    const bookingRef = push(ref(db, `users/${selectedVet.id}/bookings`));
    set(bookingRef, newBooking);

    set(ref(db, `users/${selectedVet.id}/schedule/${selectedDate}/${selectedTimeSlot}`), 'busy');
    setBookings([...bookings, selectedTimeSlot]);

    toast.success("Booking successfully added!");
    setSelectedTimeSlot("");
    setCustomerInfo({
      name: '',
      phone: '',
      reason: ''
    });
  };

  return (
    <div className="schedule-management-container">
      <h1>Manage Vet Schedules</h1>
      <select onChange={(e) => handleVetSelect(e.target.value)}>
        <option value="">Select Veterinarian</option>
        {vets.map(vet => (
          <option key={vet.id} value={vet.id}>{vet.username}</option>
        ))}
      </select>
      <input type="date" onChange={(e) => handleDateChange(e.target.value)} />
      <div>
        <h2>Customer Information</h2>
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={customerInfo.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Customer Phone"
          value={customerInfo.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason for Visit"
          value={customerInfo.reason}
          onChange={handleChange}
        />
      </div>
      <div>
        <h2>Morning</h2>
        <div className="time-slots">
          {timeSlots.slice(0, 8).map(time => (
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
        <h2>Afternoon</h2>
        <div className="time-slots">
          {timeSlots.slice(8).map(time => (
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
      <button onClick={handleBooking}>Book Appointment</button>
      <ToastContainer />
    </div>
  );
};

export default VetScheduleManagement;
