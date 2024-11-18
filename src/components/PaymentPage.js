import React, { useEffect } from "react";

const PaymentPage = () => {
  useEffect(() => {
    window.Moyasar.init({
      element: ".mysr-form",
      amount: 200,
      currency: "SAR",
      description: "Coffee Order #1",
      publishable_api_key: "pk_live_xEa2YukEoWJrofHZWjGDzokYh5pfbCTHrQfaK1oE",
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
