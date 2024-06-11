import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VetScheduling.css';

const VetScheduling = () => {
  const [vets, setVets] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);

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
    setSelectedTimes([]);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimes([]);
  };

  const handleTimeSelect = (time) => {
    setSelectedTimes(prevTimes => 
      prevTimes.includes(time) ? prevTimes.filter(t => t !== time) : [...prevTimes, time]
    );
  };

  const handleSchedule = async () => {
    try {
      if (!selectedVet || !selectedDate || selectedTimes.length === 0) {
        toast.error('Please select a veterinarian, date, and times!');
        return;
      }

      const vetId = selectedVet.id;
      const db = getDatabase();

      for (let time of selectedTimes) {
        const scheduleTimeRef = ref(db, `users/${vetId}/schedule/${selectedDate}/${time}`);
        await set(scheduleTimeRef, true);
      }

      toast.success('Schedule created successfully!');
    } catch (error) {
      toast.error('Error creating schedule!');
    }
  };

  return (
    <div className="scheduling-container">
      <h1>Schedule Vets</h1>
      <select onChange={(e) => handleVetSelect(e.target.value)}>
        <option value="">Select Veterinarian</option>
        {vets.map(vet => (
          <option key={vet.id} value={vet.id}>{vet.fullname}</option>
        ))}
      </select>
      <input type="date" onChange={handleDateChange} />
      <div className="time-slots">
        <h2>Morning</h2>
        {timeSlots.slice(0, 8).map(time => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={selectedTimes.includes(time) ? 'selected' : ''}
          >
            {time}
          </button>
        ))}
        <h2>Afternoon</h2>
        {timeSlots.slice(8).map(time => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={selectedTimes.includes(time) ? 'selected' : ''}
          >
            {time}
          </button>
        ))}
      </div>
      <button onClick={handleSchedule}>Create Schedule</button>
      <ToastContainer />
    </div>
  );
};

export default VetScheduling;
