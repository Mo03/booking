import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addBooking } from "../services/api";

const BookingConfirmed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      try {
        // Get URL parameters first
        const params = new URLSearchParams(location.search);
        const paymentId = params.get("id");
        const status = params.get("status");

        // Add debug logging
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

        // Get the stored booking data
        const storedData = rawStoredData ? JSON.parse(rawStoredData) : null;
        console.log("Parsed stored data:", storedData);

        if (!storedData) {
          setError("لم يتم العثور على بيانات الحجز. الرجاء المحاولة مرة أخرى");
          return;
        }

        if (status !== "paid") {
          throw new Error("Payment was not successful");
        }

        // Create booking payload
        const bookingPayload = {
          ...storedData.bookingData,
          paymentId,
          paymentStatus: status,
        };

        // Add booking to database
        const response = await addBooking(bookingPayload, storedData.tenantID);

        // Format date and time
        const bookingDate = new Date(storedData.bookingData.bookingDate);
        const formattedDate = bookingDate.toLocaleDateString("ar-SA");
        const formattedTime = storedData.bookingData.startTime;

        // Set confirmation data
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

        // Clear stored data
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
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return (
      <div className="booking-error">
        <h2>{error.title}</h2>
        <p>{error.message}</p>
        <div className="booking-error-actions">
          <button onClick={() => navigate("/")}>العودة للصفحة الرئيسية</button>
          <button onClick={() => navigate("/booking")}>حجز جديد</button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-confirmation">
      <h2>تم تأكيد الحجز</h2>
      {confirmationData && (
        <>
          <p>رقم المرجع: {confirmationData.bookingReference}</p>
          <p>التاريخ: {confirmationData.formattedDate}</p>
          <p>الوقت: {confirmationData.formattedTime}</p>
          <p>الخدمة: {confirmationData.serviceInfo.name}</p>
          <p>السعر: {confirmationData.serviceInfo.price} ريال</p>
        </>
      )}
      <button onClick={() => navigate("/")}>العودة للصفحة الرئيسية</button>
    </div>
  );
};

export default BookingConfirmed;
