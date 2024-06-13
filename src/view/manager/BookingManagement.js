import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase, update } from "firebase/database";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      const usersMap = {};

      
      for (const userId in usersData) {
        usersMap[userId] = {
          name: usersData[userId].username,
          phone: usersData[userId].phone
        };
      }

      const bookingPromises = [];

      for (const userId in usersData) {
        const userBookingsRef = ref(db, `users/${userId}/bookings`);
        const bookingPromise = new Promise((resolve) => {
          onValue(userBookingsRef, (bookingsSnapshot) => {
            const userBookings = [];
            bookingsSnapshot.forEach((bookingSnapshot) => {
              const bookingId = bookingSnapshot.key;
              const bookingData = bookingSnapshot.val();
              if (bookingData.status === 'Paid') { 
                userBookings.push({
                  id: bookingId,
                  userId,
                  ...bookingData,
                  name: usersMap[userId]?.name,
                  phone: usersMap[userId]?.phone
                });
              }
            });
            resolve(userBookings);
          });
        });
        bookingPromises.push(bookingPromise);
      }

      Promise.all(bookingPromises).then(allBookings => {
        setBookings(allBookings.flat());
        setLoading(false);
      });
    });
  }, []);

  const handleCancelBooking = async (userId, bookingId) => {
    const db = getDatabase();
    const bookingRef = ref(db, `users/${userId}/bookings/${bookingId}`);

    try {
      await update(bookingRef, { status: 'cancelled', amountToPay: 0 });
      setBookings(bookings.map(booking => booking.id === bookingId ? { ...booking, status: 'cancelled', amountToPay: 0 } : booking));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(`Error cancelling booking: ${error.message}`);
    }
  };

  const handleCheckInBooking = async (userId, bookingId) => {
    const db = getDatabase();
    const bookingRef = ref(db, `users/${userId}/bookings/${bookingId}`);

    try {
      await update(bookingRef, { status: 'checked-in' });
      setBookings(bookings.map(booking => booking.id === bookingId ? { ...booking, status: 'checked-in' } : booking));
      toast.success('Checked-in successful');
    } catch (error) {
      console.error("Error checking in:", error);
      toast.error(`Error checking in: ${error.message}`);
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
            <th>Status</th>
            <th>Amount to Pay</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.bookingId}</td>
              <td>{booking.name}</td>
              <td>{booking.phone}</td>
              <td>{booking.date}</td>
              <td>{booking.status}</td>
              <td>{booking.amountToPay}</td>
              <td>
                {booking.status !== 'cancelled' && (
                  <button onClick={() => handleCancelBooking(booking.userId, booking.id)}>Cancel</button>
                )}
                {booking.status !== 'cancelled' && booking.status !== 'checked-in' && (
                  <button onClick={() => handleCheckInBooking(booking.userId, booking.id)}>Check-in</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default BookingManagement;
