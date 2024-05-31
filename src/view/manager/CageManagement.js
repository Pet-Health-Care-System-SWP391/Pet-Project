import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase, update, push, remove } from "firebase/database";
import './CageManagement.css';

const CageManagement = () => {
  const [cages, setCages] = useState([]);
  const [newCageName, setNewCageName] = useState('');
  const [newCageStatus, setNewCageStatus] = useState('');
  const [editingCageId, setEditingCageId] = useState(null);
  const [editingCageName, setEditingCageName] = useState('');
  const [editingCageStatus, setEditingCageStatus] = useState('');

  useEffect(() => {
    const db = getDatabase();

    const cagesRef = ref(db, 'cages');

    onValue(cagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCages(Object.values(data));
      } else {
        setCages([]);
      }
    });
  }, []);

  const handleAddCage = () => {
    const db = getDatabase();
    const newCageRef = push(ref(db, 'cages'));
    update(newCageRef, { name: newCageName, status: newCageStatus });
    setNewCageName('');
    setNewCageStatus('');
  };

  const handleEditCage = (cageId) => {
    setEditingCageId(cageId);
  };

  const handleUpdateCage = () => {
    const db = getDatabase();
    const cageRef = ref(db, `cages/${editingCageId}`);
    update(cageRef, { name: editingCageName, status: editingCageStatus });
    setEditingCageId(null);
  };

  const handleDeleteCage = (cageId) => {
    const db = getDatabase();
    const cageRef = ref(db, `cages/${cageId}`);
    remove(cageRef);
  };

  return (
    <div className="cage-management">
      <h1>Quản lý chuồng</h1>
      <div className="cage-list">
        <h2>Danh sách chuồng</h2>
        <ul>
          {cages.map(cage => (
            <li key={cage.cageId}>
              <span>{cage.name}</span>
              <span>{cage.status === 'empty' ? 'Trống' : 'Đã có thú cưng'}</span>
              <button onClick={() => handleEditCage(cage.cageId)}>Sửa</button>
              <button onClick={() => handleDeleteCage(cage.cageId)}>Xóa</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="add-cage">
        <h2>Thêm chuồng mới</h2>
        <form>
          <label>Tên chuồng:</label>
          <input type="text" value={newCageName} onChange={(e) => setNewCageName(e.target.value)} />
          <br />
          <label>Tình trạng:</label>
          <select value={newCageStatus} onChange={(e) => setNewCageStatus(e.target.value)}>
            <option value="empty">Trống</option>
            <option value="occupied">Đã có thú cưng</option>
          </select>
          <br />
          <button onClick={handleAddCage}>Thêm</button>
        </form>
      </div>
      {editingCageId && (
        <div className="edit-cage">
          <h2>Sửa chuồng</h2>
          <form>
            <label>Tên chuồng:</label>
            <input type="text" value={editingCageName} onChange={(e) => setEditingCageName(e.target.value)} />
            <br />
            <label>Tình trạng:</label>
            <select value={editingCageStatus} onChange={(e) => setEditingCageStatus(e.target.value)}>
              <option value="empty">Trống</option>
              <option value="occupied">Đã có thú cưng</option>
            </select>
            <br />
            <button onClick={handleUpdateCage}>Cập nhật</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CageManagement;