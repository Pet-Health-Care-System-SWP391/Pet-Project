import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../../Components/firebase/firebase';
import Dashboard from './Dashboard';
import BookingManagement from './BookingManagement';
import CageManagement from './CageManagement';
import MedicalRecords from './MedicalRecords';
import VetScheduling from './VetScheduling';
import VetScheduleManagement from './VetScheduleManagement ';
import Sidebar from './Sidebar'; 
import { getDatabase, ref, onValue } from "firebase/database";

const Manager = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data.role !== "manager") {
            toast.error("You can't access this site!");
            navigate("/");
          } else {
            setUser(user);
            setLoading(false);
          }
        });
      } else {
        setUser(null);
        setLoading(false);
        navigate("/signIn");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manager-container">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cages" element={<CageManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="vet-scheduling" element={<VetScheduling />} />
          <Route path="vet-schedule-management" element={<VetScheduleManagement />} />
        </Routes>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default Manager;
