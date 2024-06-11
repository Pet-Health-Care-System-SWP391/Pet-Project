import React, { useState, useEffect } from "react";
import SignIn from "./Components/googleSignIn/signIn";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "../src/view/partials/Home";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./view/partials/Header";
import { auth, provider } from "./Components/firebase/firebase";
import Update from "./view/account/Update";
import Admin from "../src/view/admin/Admin";
import Manager from "../src/view/manager/Manager";
import Pet from "../src/view/pet/Pet";
import AddPet from "../src/view/pet/AddPet";
import Book from "../src/view/booking/Book";
import QrCodePage from "../src/view/qr/QrCodePage";
import Transaction from "../src/Components/transaction/TransactionHistory";
import { TransactionProvider } from "../src/Components/context/TransactionContext";
import ForgotPassword from "./Components/googleSignIn/ForgotPassword";
import BookingManagement from "./view/manager/BookingManagement";
import CageManagement from "./view/manager/CageManagement";
import MedicalRecords from "./view/manager/MedicalRecords";
import VetScheduling from "./view/manager/VetScheduling";
import VetScheduleManagement from "./view/manager/VetScheduleManagement ";
import VetScheduler from "./view/manager/VetScheduler";

function MainContent() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const userRole = "manager";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    const handleLoading = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500); 
    };

    handleLoading();

    return () => {
      unsubscribe();
      clearTimeout(handleLoading);
    };
  }, [location.pathname]);

  return (
    <div className="App">
      {loading && (
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {!loading && (
        <>
          <Header user={user} setUser={setUser} role={userRole} />

          <Routes>
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Update user={user} />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/manager/*" element={<Manager />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="cages" element={<CageManagement />} />
            <Route path="medical-records" element={<MedicalRecords />} />
            <Route path="vet-scheduling" element={<VetScheduling />} />
            <Route path="vet-schedule-management" element={<VetScheduleManagement />} />
            <Route path="vet-scheduler" element={<VetScheduler />} />
            <Route path="/pet" element={<Pet />} />
            <Route path="/pet/add" element={<AddPet />} />
            <Route path="/book" element={<Book />} />
            <Route path="/qr" element={<QrCodePage />} />
            <Route path="/transaction-history" element={<Transaction />} />
            <Route path="/reset" element={<ForgotPassword />} />
          </Routes>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <TransactionProvider>
      <Router>
        <MainContent />
        <ToastContainer autoClose={3000} />
      </Router>
    </TransactionProvider>
  );
}

export default App;