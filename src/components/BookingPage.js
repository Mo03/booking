import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingPage.css";
import { useTenant } from "../TenantContext";
import Loader from "./common/Loader";
import backIcon from "../assets/backIcon.svg"; // Import the back icon

import PaymentPage from "./PaymentPage";
import BookingConfirmation from "./BookingConfirmation";
import ReviewPage from "./ReviewPage";

const BookingPage = () => {
  const tenantID = useTenant();
  const [firstName, setFirstName] = useState("test");
  const [lastName, setLastName] = useState("test");
  const [email, setEmail] = useState("test@gmail.com");
  const [PhoneNumber, setPhone] = useState("512345678");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, selectedDate, selectedTime, serviceName, price } =
    location.state;
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  const validate = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "الاسم الأول مطلوب";
    if (!lastName) newErrors.lastName = "اسم العائلة مطلوب";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!emailPattern.test(email))
      newErrors.email = "تنسيق البريد الإلكتروني غير صالح";

    const phonePattern = /^5\d{8}$/;
    if (!PhoneNumber) newErrors.PhoneNumber = "رقم الهاتف مطلوب";
    else if (!phonePattern.test(PhoneNumber))
      newErrors.PhoneNumber =
        "يجب أن يبدأ رقم الهاتف بـ '5' وأن يكون مكونًا من 9 أرقام";

    return newErrors;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
        PhoneNumber,
      },
      serviceId,
      bookingDate: formattedDate,
      startTime: selectedTime,
      serviceName: serviceName, // Add this explicitly
      price: price, // Add this explicitly
    };
    console.log("Review Data:", bookingData);

    setReviewData({
      ...bookingData,
      serviceName: location.state?.serviceName,
      price: location.state?.price,
    });
    setShowReview(true);
  };

  const handleReviewBack = () => {
    setShowReview(false);
  };

  const handleReviewConfirm = () => {
    setBookingData(reviewData);
    setShowReview(false);
    setShowPayment(true);
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString();
  const formattedTime = new Date(
    `1970-01-01T${selectedTime}`
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="booking-page-container">
      <div className="header">
        <button className="back-button" onClick={handleBackClick}>
          <img
            src={backIcon}
            alt="Back"
            style={{ width: "24px", height: "24px" }}
          />
        </button>
        <h4 style={{ marginTop: "13px" }}>{tenantID}</h4>
      </div>
      <div className="booking-page">
        {loading ? (
          <Loader />
        ) : showConfirmation ? (
          <BookingConfirmation {...confirmationData} />
        ) : showPayment ? (
          <PaymentPage
            amount={price || 0}
            bookingData={bookingData}
            tenantID={tenantID}
            serviceName={serviceName}
            price={price}
            setShowConfirmation={setShowConfirmation}
            setShowPayment={setShowPayment}
            setLoading={setLoading}
            setErrors={setErrors}
            setConfirmationData={setConfirmationData}
          />
        ) : showReview ? (
          <ReviewPage
            bookingDetails={reviewData}
            onConfirm={handleReviewConfirm}
            onBack={handleReviewBack}
          />
        ) : (
          <form className="booking-form" onSubmit={handleBooking}>
            {errors.form && <div className="error">{errors.form}</div>}
            <label>الاسم الأول:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {errors.firstName && (
              <div className="error">{errors.firstName}</div>
            )}
            <label style={{ margin: "5px 0" }}>اسم العائلة:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            {errors.lastName && <div className="error">{errors.lastName}</div>}
            <label style={{ margin: "5px 0" }}>البريد الإلكتروني:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
            <label style={{ margin: "5px 0" }}>الهاتف:</label>
            <input
              type="tel"
              value={PhoneNumber}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {errors.PhoneNumber && (
              <div className="error">{errors.PhoneNumber}</div>
            )}
            <button type="submit">احجز</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
