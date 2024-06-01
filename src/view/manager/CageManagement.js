import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase, update, push, remove } from "firebase/database";
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

  const handleAddCage = (e) => {
    e.preventDefault();
    const db = getDatabase();
    const newCageRef = push(ref(db, 'cages'));
    update(newCageRef, { name: newCageName, status: newCageStatus });
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
            <h2>Thêm chuồng mới</h2>
            <form onSubmit={handleAddCage}>
              <label>Tên chuồng:</label>
              <input type="text" value={newCageName} onChange={(e) => setNewCageName(e.target.value)} />
              <br />
              <label>Tình trạng:</label>
              <select value={newCageStatus} onChange={(e) => setNewCageStatus(e.target.value)}>
                <option value="Available">Trống</option>
                <option value="Occupied">Đã có thú cưng</option>
              </select>
              <br />
              <button type="submit">Thêm</button>
            </form>
          </div>
          {editingCageId && (
            <div className="edit-cage">
              <h2>Sửa chuồng</h2>
              <form onSubmit={handleUpdateCage}>
                <label>Tên chuồng:</label>
                <input type="text" value={editingCageName} onChange={(e) => setEditingCageName(e.target.value)} />
                <br />
                <label>Tình trạng:</label>
                <select value={editingCageStatus} onChange={(e) => setEditingCageStatus(e.target.value)}>
                  <option value="Available">Trống</option>
                  <option value="Occupied">Đã có thú cưng</option>
                </select>
                <br />
                <button type="submit">Cập nhật</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CageManagement;
