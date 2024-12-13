import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addBooking } from "../services/api";
import { useTenant } from "../TenantContext";
import backIcon from "../assets/backIcon.svg";
import Loader from "./common/Loader";

const BookingConfirmed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const tenantID = useTenant();

  const handleBackClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      try {
        // ... existing code ...
        const params = new URLSearchParams(location.search);
        const paymentId = params.get("id");
        const status = params.get("status");

        // ... existing code ...
        const rawStoredData = sessionStorage.getItem("pendingBookingData");
        console.log("Payment ID:", paymentId);
        console.log("Payment Status:", status);
        console.log("Raw stored data:", rawStoredData);

        if (!rawStoredData) {
          setError({
            title: "لم يتم العثور على بيانات الحجز",
            message: "يرجى التأكد من إكمال عملية الحجز من البداية",
          });
          return;
        }

        // ... existing code ...
        const storedData = rawStoredData ? JSON.parse(rawStoredData) : null;
        console.log("Parsed stored data:", storedData);

        if (!storedData) {
          setError("لم يتم العثور على بيانات الحجز. الرجاء المحاولة مرة أخرى");
          return;
        }

        if (status !== "paid") {
          throw new Error("Payment was not successful");
        }

        // ... existing code ...
        const bookingPayload = {
          ...storedData.bookingData,
          paymentId,
          paymentStatus: status,
        };

        // ... existing code ...
        const response = await addBooking(bookingPayload, storedData.tenantID);

        // ... existing code ...
        const bookingDate = new Date(storedData.bookingData.bookingDate);
        const formattedDate = bookingDate.toLocaleDateString("ar-SA");
        const formattedTime = storedData.bookingData.startTime;

        // ... existing code ...
        setConfirmationData({
          tenantID: storedData.tenantID,
          formattedDate,
          formattedTime,
          bookingReference: response.reference,
          serviceInfo: {
            name: storedData.serviceName,
            price: storedData.price,
            duration: response.duration || "60",
          },
        });

        // ... existing code ...
        sessionStorage.removeItem("pendingBookingData");
        setLoading(false);
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          paymentId: new URLSearchParams(location.search).get("id"),
          status: new URLSearchParams(location.search).get("status"),
          storedData: sessionStorage.getItem("pendingBookingData"),
        });
        setError({
          title: "حدث خطأ أثناء معالجة الدفع",
          message: error.message,
        });
        setLoading(false);
      }
    };

    handlePaymentConfirmation();
  }, [location]);

  if (loading) {
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
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
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
          <div className="booking-error">
            <h2>{error.title}</h2>
            <p>{error.message}</p>
            <div className="booking-error-actions">
              <button onClick={() => navigate("/")}>
                العودة للصفحة الرئيسية
              </button>
              <button onClick={() => navigate("/booking")}>حجز جديد</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="booking-confirmation">
          <h2>تم تأكيد الحجز</h2>
          {confirmationData && (
            <div className="confirmation-details">
              <p>
                <span>رقم المرجع:</span> {confirmationData.bookingReference}
              </p>
              <p>
                <span>التاريخ:</span> {confirmationData.formattedDate}
              </p>
              <p>
                <span>الوقت:</span> {confirmationData.formattedTime}
              </p>
              <p>
                <span>الخدمة:</span> {confirmationData.serviceInfo.name}
              </p>
              <p>
                <span>السعر:</span> {confirmationData.serviceInfo.price} ريال
              </p>
            </div>
          )}
          <button onClick={() => navigate("/")}>العودة للصفحة الرئيسية</button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
