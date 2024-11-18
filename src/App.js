import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CalendarPage from "./components/CalendarPage";
import BookingPage from "./components/BookingPage";
import NotFoundPage from "./components/NotFoundPage";
import PaymentPage from "./components/PaymentPage";
import ThanksPage from "./components/ThanksPage";
import BookingConfirmation from "./components/BookingConfirmation";
import { useTenant } from "./TenantContext";

const App = () => {
  const tenantID = useTenant();

  useEffect(() => {
    document.title = tenantID + " [ Book now ]";
  }, [tenantID]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calendar/:serviceId" element={<CalendarPage />} />
      <Route path="/calendar/:serviceId/booking" element={<BookingPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/thanks" element={<ThanksPage />} />
      <Route path="/booking-confirmed" element={<BookingConfirmation />} />
    </Routes>
  );
};

export default App;
