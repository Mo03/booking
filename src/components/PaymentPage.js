import React, { useEffect } from "react";

const PaymentPage = () => {
  useEffect(() => {
    window.Moyasar.init({
      element: ".mysr-form",
      amount: 200,
      currency: "SAR",
      description: "Coffee Order #1",
      publishable_api_key: process.env.REACT_APP_MOYASAR_PUBLISHABLE_KEY,
      callback_url: "https://moyasar.com/thanks",
      methods: ["creditcard"],
    });
  }, []);

  return (
    <div className="container">
      <h1>Payment</h1>
      <div className="mysr-form"></div>
    </div>
  );
};

export default PaymentPage;
