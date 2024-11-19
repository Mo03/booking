import React, { useEffect, useRef } from "react";
import "./PaymentPage.css";

const PaymentPage = ({ amount, onSuccess }) => {
  const paymentRef = useRef(null);

  useEffect(() => {
    if (paymentRef.current && window.Moyasar) {
      const moyasar = window.Moyasar.init({
        element: paymentRef.current,
        amount: 50, // Convert to halala
        currency: "SAR",
        description: "Service Booking Payment",
        publishable_api_key: process.env.REACT_APP_MOYASAR_KEY,
        callback_url: `${window.location.origin}/thanks`,
        methods: ["creditcard"],
        on_completed: (payment) => {
          console.log("Payment completed:", payment);
          onSuccess(payment);
        },
      });

      return () => {
        if (moyasar && moyasar.unmount) {
          moyasar.unmount();
        }
      };
    }
  }, [amount, onSuccess]);

  return (
    <div className="payment-wrapper">
      <div ref={paymentRef} id="moyasar-payment"></div>
    </div>
  );
};

export default PaymentPage;
