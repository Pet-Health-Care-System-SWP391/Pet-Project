import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase, update } from "firebase/database";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const bookingRef = ref(db, 'users');
    const bookings = [];


    onValue(bookingRef, (snapshot) => {
      snapshot.forEach((userSnapshot) => {
        const userId = userSnapshot.key;
        const userBookingsRef = ref(db, `users/${userId}/bookings`);
        onValue(userBookingsRef, (bookingsSnapshot) => {
          bookingsSnapshot.forEach((bookingSnapshot) => {
            const bookingId = bookingSnapshot.key;
            const bookingData = bookingSnapshot.val();
            bookings.push({ id: bookingId, ...bookingData });
          });
        });
      });
      setBookings(bookings);
    });
  }, []);

  const handleCancelBooking = async (id) => {
    const db = getDatabase();
    const bookingRef = ref(db, `bookings/${id}`);

    try {
      await update(bookingRef, { status: 'cancelled', amountToPay: 0 });
      setBookings(bookings.map(booking => booking.id === id ? { ...booking, status: 'cancelled', amountToPay: 0 } : booking));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(`Error cancelling booking: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="booking-management">
      <h1>Manage Bookings</h1>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Amount to Pay</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.name}</td>
              <td>{booking.phone}</td>
              <td>{booking.date}</td>
              <td>{booking.time}</td>
              <td>{booking.reason}</td>
              <td>{booking.status || 'active'}</td>
              <td>{booking.amountToPay}</td>
              <td>
                {booking.status !== 'cancelled' && (
                  <button onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingManagement;