import React, { useEffect, useRef } from "react";
import "./PaymentPage.css";
import { useNavigate } from "react-router-dom";

const PaymentPage = ({
  amount,
  bookingData,
  tenantID,
  serviceName,
  price,
  setShowConfirmation,
  setShowPayment,
  setLoading,
  setErrors,
  setConfirmationData,
}) => {
  const paymentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pendingBookingData = {
      bookingData,
      tenantID,
      serviceName,
      price,
    };
    sessionStorage.setItem(
      "pendingBookingData",
      JSON.stringify(pendingBookingData)
    );
    console.log("Saved to sessionStorage:", pendingBookingData);

    if (paymentRef.current && window.Moyasar) {
      const moyasar = window.Moyasar.init({
        element: paymentRef.current,
        amount: 1 * 100,
        currency: "SAR",
        description: `حجز ${serviceName}`,
        publishable_api_key: process.env.REACT_APP_MOYASAR_KEY,
        callback_url: `${window.location.origin}/booking-confirmed`,
        methods: ["creditcard", "applepay"],
        apple_pay: {
          country: "SA",
          label: serviceName,
          validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
        },
        on_completed: function (payment) {
          console.log("Payment completed:", payment);
          console.log("tenantID:", tenantID);
          setTimeout(() => {
            handlePaymentSuccess(payment);
          }, 30000);
        },
        metadata: {
          tenant_id: tenantID,
        },
        on_failed: (error) => {
          console.error("Payment failed:", error);
          setErrors({ form: "فشلت عملية الدفع. يرجى المحاولة مرة أخرى" });
          setLoading(false);
          setShowPayment(false);
        },
      });

      return () => {
        if (moyasar && moyasar.unmount) {
          moyasar.unmount();
        }
      };
    }
  }, [amount, bookingData, tenantID, serviceName, price]);

  const handlePaymentSuccess = async (paymentDetails) => {
    setLoading(true);

    try {
      console.log("Payment Details:", paymentDetails);

      // First, save the payment details
      const paymentResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/Payments/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Tenant-ID": tenantID,
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to save payment details");
      }

      // If payment was saved successfully, proceed with booking
      const bookingPayload = {
        ...bookingData,
        paymentId: paymentDetails.id,
        //paymentStatus: paymentDetails.status,
      };

      console.log("Processing booking with payload:", bookingPayload);
      const response = await addBooking(bookingPayload, tenantID);

      if (!response || !response.reference) {
        throw new Error("Invalid response from booking service");
      }

      const bookingDate = new Date(bookingData.bookingDate);
      const formattedDate = bookingDate.toLocaleDateString("ar-SA");
      const formattedTime = bookingData.startTime;

      const confirmationData = {
        tenantID,
        formattedDate,
        formattedTime,
        bookingReference: response.reference,
        serviceInfo: {
          name: serviceName,
          price,
          duration: response.duration || "60",
        },
      };

      setConfirmationData(confirmationData);
      setShowConfirmation(true);
      setShowPayment(false);
      setLoading(false);
    } catch (error) {
      console.error("Error processing payment/booking:", error);
      setErrors({
        form: "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم",
      });
      setLoading(false);
      setShowPayment(false);
    }
  };

  return (
    <div className="payment-wrapper">
      {!window.Moyasar && (
        <div className="payment-error">
          خطأ في تحميل نظام الدفع. يرجى تحديث الصفحة
        </div>
      )}
      <div ref={paymentRef} id="moyasar-payment"></div>
    </div>
  );
};

export default PaymentPage;
