import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage"; // Import your HomePage component
import CalendarPage from "./components/CalendarPage"; // Import the new CalendarPage component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar/:serviceId" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
};

export default App;
