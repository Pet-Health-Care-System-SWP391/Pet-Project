import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, update, remove, set } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../../Components/firebase/firebase'; 

const MedicalRecords = () => {
  const [pets, setPets] = useState([]);
  const [cages, setCages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    admissionDate: '',
    healthStatus: '',
    cageId: '',
    ownerId: ''
  });
  const [editingPetId, setEditingPetId] = useState(null);
  const [originalCageId, setOriginalCageId] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const petsRef = ref(db, 'pets');
    const cagesRef = ref(db, 'cages');

    onValue(petsRef, (snapshot) => {
      const data = snapshot.val();
      const petsList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      })) : [];
      setPets(petsList);
    });

    onValue(cagesRef, (snapshot) => {
      const data = snapshot.val();
      const cagesList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      })) : [];
      setCages(cagesList);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isCageOccupied = (cageId) => {
    return pets.some(pet => pet.cageId === cageId && pet.id !== editingPetId);
  };

  const isCageExist = (cageId) => {
    return cages.some(cage => cage.id === cageId);
  };

  const handleAddPet = () => {
    const db = getDatabase();
    const petsRef = ref(db, 'pets');
    const newPetRef = push(petsRef);

    if (!isCageExist(formData.cageId)) {
      toast.error('Selected cage does not exist!');
      return;
    }

    if (isCageOccupied(formData.cageId)) {
      toast.error('Selected cage already has a pet!');
      return;
    }

    set(newPetRef, formData);
    const cageRef = ref(db, `cages/${formData.cageId}`);
    update(cageRef, { status: 'Occupied' });
    toast.success('Pet added successfully!');
  };

  const handleUpdatePet = () => {
    if (editingPetId) {
      if (!isCageExist(formData.cageId)) {
        toast.error('Selected cage does not exist!');
        return;
      }

      if (isCageOccupied(formData.cageId)) {
        toast.error('Selected cage already has a pet!');
        return;
      }

      const db = getDatabase();
      const petRef = ref(db, `pets/${editingPetId}`);
      update(petRef, formData);

      // Update cage statuses
      if (originalCageId && originalCageId !== formData.cageId) {
        const originalCageRef = ref(db, `cages/${originalCageId}`);
        update(originalCageRef, { status: 'Available' });

        const newCageRef = ref(db, `cages/${formData.cageId}`);
        update(newCageRef, { status: 'Occupied' });
      }

      toast.success('Pet updated successfully!');
      setEditingPetId(null);
      setOriginalCageId('');
    }
  };

  const handleDeletePet = (id) => {
    const db = getDatabase();
    const petRef = ref(db, `pets/${id}`);
    const pet = pets.find(p => p.id === id);
    remove(petRef);

    const cageRef = ref(db, `cages/${pet.cageId}`);
    update(cageRef, { status: 'Available' });
    toast.success('Pet deleted successfully!');
  };

  const handleEditPet = (pet) => {
    setFormData(pet);
    setEditingPetId(pet.id);
    setOriginalCageId(pet.cageId); // Store the original cage ID to update its status later if needed
  };

  return (
    <div>
      <h1>Manage Medical Records</h1>
      <div>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="species" placeholder="Species" value={formData.species} onChange={handleChange} />
        <input name="admissionDate" placeholder="Admission Date" value={formData.admissionDate} onChange={handleChange} />
        <input name="healthStatus" placeholder="Health Status" value={formData.healthStatus} onChange={handleChange} />
        <input name="cageId" placeholder="Cage ID" value={formData.cageId} onChange={handleChange} />
        <input name="ownerId" placeholder="Owner ID" value={formData.ownerId} onChange={handleChange} />
        <button onClick={editingPetId ? handleUpdatePet : handleAddPet}>
          {editingPetId ? 'Update Pet' : 'Add Pet'}
        </button>
      </div>
      <ul>
        {pets.map(pet => (
          <li key={pet.id}>
            {pet.name} - {pet.species} - {pet.admissionDate} - {pet.healthStatus} - {pet.cageId} - {pet.ownerId}
            <button onClick={() => handleEditPet(pet)}>Edit</button>
            <button onClick={() => handleDeletePet(pet.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default MedicalRecords;
