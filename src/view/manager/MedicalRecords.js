import { database } from '../../Components/firebase/firebase'; 
import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const recordsCollection = await database.collection('medicalRecords').get();
      setRecords(recordsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchRecords();
  }, []);

  const updateRecord = async (id, updatedData) => {
    await database.collection('medicalRecords').doc(id).update(updatedData);
    setRecords(records.map(record => record.id === id ? { ...record, ...updatedData } : record));
  };

  return (
    <div>
      <h1>Manage Medical Records</h1>
      <ul>
        {records.map(record => (
          <li key={record.id}>
            {record.details}
            <button onClick={() => updateRecord(record.id, { details: 'Updated details' })}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalRecords;
