// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage"; // Import your HomePage component
import CalendarPage from "./components/CalendarPage"; // Import the new CalendarPage component
import BookingPage from "./components/BookingPage"; // Import the BookingPage component

const App = () => {
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
