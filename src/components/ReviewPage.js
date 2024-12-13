import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewPage.css";
import backIcon from "../assets/backIcon.svg";
import { useTenant } from "../TenantContext";

const ReviewPage = ({ bookingDetails, onConfirm, onBack }) => {
  const tenantID = useTenant();
  const navigate = useNavigate();

  const handleBackClick = () => {
    onBack();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ar-SA");
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="review-page-container">
      <div className="review-page">
        <h2>مراجعة الحجز</h2>
        <div className="review-details">
          <div className="review-section">
            <h3>تفاصيل الخدمة</h3>
            <p>
              <span>الخدمة:</span> {bookingDetails.serviceName}
            </p>
            <p>
              <span>السعر:</span> {bookingDetails.price} ريال
            </p>
          </div>

          <div className="review-section">
            <h3>موعد الحجز</h3>
            <p>
              <span>التاريخ:</span> {formatDate(bookingDetails.bookingDate)}
            </p>
            <p>
              <span>الوقت:</span> {formatTime(bookingDetails.startTime)}
            </p>
          </div>

          <div className="review-section">
            <h3>معلومات العميل</h3>
            <p>
              <span>الاسم:</span> {bookingDetails.user.firstName}{" "}
              {bookingDetails.user.lastName}
            </p>
            <p>
              <span>البريد الإلكتروني:</span> {bookingDetails.user.email}
            </p>
            <p>
              <span>رقم الجوال:</span> {bookingDetails.user.PhoneNumber}
            </p>
          </div>
        </div>
        <button className="confirm-button" onClick={onConfirm}>
          متابعة للدفع
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;
