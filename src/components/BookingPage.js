import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./BookingPage.css";
import { useTenant } from "../TenantContext";
import { addBooking } from "../services/api";

const BookingPage = () => {
  const tenantID = useTenant();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingReference, setBookingReference] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, selectedDate, selectedTime } = location.state;

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const updatedDate = new Date(selectedDate);

    const year = updatedDate.getFullYear();
    const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
    const day = String(updatedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}T00:00:00`;

    const bookingData = {
      user: {
        firstName,
        lastName,
        email,
        phone,
      },
      serviceId,
      bookingDate: formattedDate,
      startTime: selectedTime,
    };

    try {
      const response = await addBooking(bookingData, tenantID);
      console.log("response ----------->", response);
      setBookingReference(response.reference);
    } catch (error) {
      console.error("Error booking slot:", error);
      setError("Error booking slot");
    }
  };

  return (
    <div className="booking-page">
      <button className="back-button" onClick={handleBackClick}>
        &larr; Back
      </button>
      {bookingReference ? (
        <div className="booking-confirmation">
          <h2>Booking Confirmed!</h2>
          <p>Your booking reference is: {bookingReference}</p>
        </div>
      ) : (
        <form className="booking-form" onSubmit={handleBooking}>
          <h2>Book Your Slot</h2>
          {error && <div className="error">{error}</div>}
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
          <button type="submit">Book Slot</button>
        </form>
      )}
    </div>
  );
};

export default BookingPage;
