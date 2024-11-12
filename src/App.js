import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CalendarPage from "./components/CalendarPage";
import BookingPage from "./components/BookingPage";
import NotFoundPage from "./components/NotFoundPage";
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
      <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
