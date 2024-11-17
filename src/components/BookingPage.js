import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingPage.css";
import { useTenant } from "../TenantContext";
import { addBooking } from "../services/api";
import Loader from "./common/Loader";
import backIcon from "../assets/backIcon.svg"; // Import the back icon
import dateIcon from "../assets/dateIcon.svg"; // Import the date icon
import timeIcon from "../assets/timeIcon.svg"; // Import the time icon
import bookingIcon from "../assets/bookingIcon.svg"; // Import the booking ID icon
import serviceIcon from "../assets/serviceIcon.svg"; // Import the service icon
import copyIcon from "../assets/copyIcon.svg"; // Import the copy icon

const BookingPage = () => {
  const tenantID = useTenant();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [PhoneNumber, setPhone] = useState("");
  const [bookingReference, setBookingReference] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, selectedDate, selectedTime, serviceName } = location.state;
  const [serviceInfo, setServiceInfo] = useState();
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

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
    };

    try {
      const response = await addBooking(bookingData, tenantID);
      setBookingReference(response.reference);
      setServiceInfo(response.service);
    } catch (error) {
      console.error("Error booking slot:", error);
      setErrors({ form: "خطأ في حجز الموعد" });
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString();
  const formattedTime = new Date(
    `1970-01-01T${selectedTime}`
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopyBookingID = () => {
    navigator.clipboard.writeText(bookingReference).then(
      () => {
        alert("تم نسخ رقم الحجز إلى الحافظة!");
      },
      (err) => {
        console.error("Could not copy booking ID: ", err);
      }
    );
  };

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
        ) : bookingReference ? (
          <div className="booking-confirmation">
            <h2>! تم تأكيد الحجز</h2>
            <h4>مع {tenantID}</h4>
            <p>
              <img
                src={dateIcon}
                alt="Date"
                style={{ width: "20px", marginRight: "8px" }}
              />
              التاريخ: <span> &nbsp; {formattedDate}</span>
            </p>
            <p>
              <img
                src={timeIcon}
                alt="Time"
                style={{ width: "20px", marginRight: "8px" }}
              />
              الوقت: <span> &nbsp; {formattedTime}</span>
            </p>
            <p>
              رقم الحجز: <span> &nbsp; {bookingReference} </span>
              <button
                onClick={handleCopyBookingID}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "8px",
                }}
              >
                <img
                  src={copyIcon}
                  alt="Copy"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
            </p>
            <p>
              الخدمة: <span> &nbsp; {serviceInfo.name} </span>
            </p>
            <p>
              السعر: <span> &nbsp; {serviceInfo.price} ريال</span>
            </p>
            <p>
              المدة: <span> &nbsp; {serviceInfo.duration} دقيقة</span>
            </p>
          </div>
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
