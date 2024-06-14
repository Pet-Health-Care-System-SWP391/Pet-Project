import React, { useState } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './AddCage.css';

const AddCage = () => {
  const [newCageName, setNewCageName] = useState('');
  const [newCageStatus, setNewCageStatus] = useState('Available');
  const navigate = useNavigate();

  const generateCageId = async () => {
    const db = getDatabase();
    const cagesRef = ref(db, 'cages');
    const snapshot = await get(cagesRef);
    const data = snapshot.val();
    const numberOfCages = data ? Object.keys(data).length : 0;
    return `cage${numberOfCages + 1}`;
  };

  const handleAddCage = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const newCageId = await generateCageId();
    const newCageRef = ref(db, `cages/${newCageId}`);
    set(newCageRef, { name: newCageName, status: newCageStatus, id: newCageId });
    setNewCageName('');
    setNewCageStatus('Available');
    navigate('/manager/cages');
  };

  return (
    <div className="add-cage">
      <h2>Add New Cage</h2>
      <form onSubmit={handleAddCage}>
        <label>Cage name:</label>
        <input type="text" value={newCageName} onChange={(e) => setNewCageName(e.target.value)} required />
        <label>Status:</label>
        <select value={newCageStatus} onChange={(e) => setNewCageStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Already has a pet">Already has a pet</option>
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddCage;
