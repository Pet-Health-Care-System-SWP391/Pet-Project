import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase, update, push, remove, set, get } from "firebase/database";
import './CageManagement.css';

const CageManagement = () => {
  const [cages, setCages] = useState([]);
  const [newCageName, setNewCageName] = useState('');
  const [newCageStatus, setNewCageStatus] = useState('Available');
  const [editingCageId, setEditingCageId] = useState(null);
  const [editingCageName, setEditingCageName] = useState('');
  const [editingCageStatus, setEditingCageStatus] = useState('Available');

  useEffect(() => {
    const db = getDatabase();
    const cagesRef = ref(db, 'cages');

    onValue(cagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCages(Object.entries(data).map(([id, cage]) => ({ id, ...cage })));
      } else {
        setCages([]);
      }
    });
  }, []);

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
  };

  const handleEditCage = (cage) => {
    setEditingCageId(cage.id);
    setEditingCageName(cage.name);
    setEditingCageStatus(cage.status);
  };

  const handleUpdateCage = (e) => {
    e.preventDefault();
    const db = getDatabase();
    const cageRef = ref(db, `cages/${editingCageId}`);
    update(cageRef, { name: editingCageName, status: editingCageStatus });
    setEditingCageId(null);
    setEditingCageName('');
    setEditingCageStatus('Available');
  };

  const handleDeleteCage = (cageId) => {
    const db = getDatabase();
    const cageRef = ref(db, `cages/${cageId}`);
    remove(cageRef);
  };

  return (
    <div className="cage-management">
      <h1>Cage Management</h1>
      <div className="content">
        <div className="cage-list">
          <h2>List of cages</h2>
          <ul>
            {cages.map(cage => (
              <li key={cage.id}>
                <span>{cage.name}</span>
                <span>{cage.status === 'Available' ? 'Available' : 'Already have a pet'}</span>
                <button onClick={() => handleEditCage(cage)}>Edit</button>
                <button onClick={() => handleDeleteCage(cage.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="forms">
          <div className="add-cage">
            <h2>Add new cage</h2>
            <form onSubmit={handleAddCage}>
              <label>Cage name:</label>
              <input type="text" value={newCageName} onChange={(e) => setNewCageName(e.target.value)} />
              <br />
              <label>Status:</label>
              <select value={newCageStatus} onChange={(e) => setNewCageStatus(e.target.value)}>
                <option value="Available">Available</option>
                <option value="Occupied">Already have a pet</option>
              </select>
              <br />
              <button type="submit">Add</button>
            </form>
          </div>
          {editingCageId && (
            <div className="edit-cage">
              <h2>Edit Cage</h2>
              <form onSubmit={handleUpdateCage}>
                <label>Cage name:</label>
                <input type="text" value={editingCageName} onChange={(e) => setEditingCageName(e.target.value)} />
                <br />
                <label>Status:</label>
                <select value={editingCageStatus} onChange={(e) => setEditingCageStatus(e.target.value)}>
                  <option value="Available">Available</option>
                  <option value="Occupied">Already have a pet</option>
                </select>
                <br />
                <button type="submit">Update</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CageManagement;
