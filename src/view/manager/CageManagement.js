import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase, update, push, remove, set, get } from "firebase/database";
import './CageManagement.css';

const CageManagement = () => {
  const [cages, setCages] = useState([]);
  const [newCageName, setNewCageName] = useState('');
  const [newCageStatus, setNewCageStatus] = useState('Available');
  const [editingCageId, setEditingCageId] = useState(null);

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
  };

  const handleSaveCage = (cageId, name, status) => {
    const db = getDatabase();
    const cageRef = ref(db, `cages/${cageId}`);
    update(cageRef, { name, status });
    setEditingCageId(null);
  };

  const handleDeleteCage = (cageId) => {
    const db = getDatabase();
    const cageRef = ref(db, `cages/${cageId}`);
    remove(cageRef);
  };

  return (
    <div className="cage-management">
      <h1>Cage Management</h1>
      <div className="add-cage">
        <h2>Add new cage</h2>
        <form onSubmit={handleAddCage}>
          <label>Cage name:</label>
          <input type="text" value={newCageName} onChange={(e) => setNewCageName(e.target.value)} />
          <label>Status:</label>
          <select value={newCageStatus} onChange={(e) => setNewCageStatus(e.target.value)}>
            <option value="Available">Available</option>
            <option value="Already has a pet">Already has a pet</option>
          </select>
          <button type="submit">Add</button>
        </form>
      </div>
      <table className="cage-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cages.map(cage => (
            <tr key={cage.id}>
              <td>{cage.id}</td>
              <td>
                {editingCageId === cage.id ? (
                  <input
                    type="text"
                    defaultValue={cage.name}
                    onChange={(e) => cage.name = e.target.value}
                  />
                ) : (
                  cage.name
                )}
              </td>
              <td>
                {editingCageId === cage.id ? (
                  <select
                    defaultValue={cage.status}
                    onChange={(e) => cage.status = e.target.value}
                  >
                    <option value="Available">Available</option>
                    <option value="Already has a pet">Already has a pet</option>
                  </select>
                ) : (
                  cage.status === 'Available' ? 'Available' : 'Already has a pet'
                )}
              </td>
              <td>
                {editingCageId === cage.id ? (
                  <button onClick={() => handleSaveCage(cage.id, cage.name, cage.status)}>Save</button>
                ) : (
                  <button onClick={() => handleEditCage(cage)}>Edit</button>
                )}
                <button onClick={() => handleDeleteCage(cage.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CageManagement;
