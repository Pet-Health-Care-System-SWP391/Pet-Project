import { database } from '../../Components/firebase/firebase'; 
import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";

const VetScheduling = () => {
  const [schedule, setSchedule] = useState('');

  const addSchedule = async () => {
    await database.collection('vetSchedules').add({ schedule });
    setSchedule('');
  };

  return (
    <div>
      <h1>Schedule Vets</h1>
      <input value={schedule} onChange={e => setSchedule(e.target.value)} />
      <button onClick={addSchedule}>Add Schedule</button>
    </div>
  );
};

export default VetScheduling;
