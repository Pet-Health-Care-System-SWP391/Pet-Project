import React, { useState, useEffect } from 'react';
import { ref, onValue, getDatabase, update } from "firebase/database";
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const userId = '5fYbf1gw6xPGwQ5pgO7VHwICYg92';
    const bookingRef = ref(db, `users/${userId}/bookings`);
  
    const unsubscribe = onValue(bookingRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const bookingList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setBookings(bookingList);
        setLoading(false);
      } else {
        console.log("No data found in bookings node");
        setBookings([]);
        setLoading(false);
      }
    }, {
      onlyOnce: true,
    });
  
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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

  return (
    <div>
      <h1>Manage Bookings</h1>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.name} - {booking.time} - {booking.status || 'active'}
            {booking.status !== 'cancelled' && <button onClick={() => handleCancelBooking(booking.id)}>Cancel</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingManagement;