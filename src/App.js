import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import CalendarPage from "./components/CalendarPage";
import BookingPage from "./components/BookingPage";
import { useTenant } from "./TenantContext";

const App = () => {
  // const tenantID = useTenant();
  const tenantID = "testty";

  useEffect(() => {
    document.title = tenantID + " [ Book now ]";
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar/:serviceId" element={<CalendarPage />} />
        <Route path="/calendar/:serviceId/booking" element={<BookingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
