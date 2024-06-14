import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase, update, remove, get } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import './CageManagement.css';

const CageManagement = () => {
  const [cages, setCages] = useState([]);
  const [editingCageId, setEditingCageId] = useState(null);
  const navigate = useNavigate();

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

  const handleAddCage = () => {
    navigate('/manager/add-cage');
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
      <button onClick={handleAddCage} className="add-cage-button">Add New Cage</button>
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
