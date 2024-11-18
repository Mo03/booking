import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ThanksPage.css";

const ThanksPage = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/booking-confirmed", {
        state: bookingData,
        replace: true,
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate, bookingData]);

  // Show loading or redirect if no booking data
  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="thanks-container">
      <h1>!شكراً لك على الدفع</h1>
      <p>تمت معالجة الدفع بنجاح</p>
      <p>جارٍ التوجيه إلى تأكيد الحجز خلال {countdown} ثوانٍ...</p>
    </div>
  );
};

export default ThanksPage;
