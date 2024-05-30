import { database } from '../../Components/firebase/firebase'; 
import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";

const KennelManagement = () => {
  const [kennels, setKennels] = useState([]);

  useEffect(() => {
    const fetchKennels = async () => {
      const kennelCollection = await database.collection('kennels').get();
      setKennels(kennelCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchKennels();
  }, []);

  return (
    <div>
      <h1>Manage Kennels</h1>
      <ul>
        {kennels.map(kennel => (
          <li key={kennel.id}>{kennel.name} - {kennel.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default KennelManagement;
