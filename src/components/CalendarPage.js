import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AvailableSlotsCalendar from "./AvailableSlotsCalendar"; // Reuse this component
import "./CalendarPage.css"; // Import CSS for styling

const CalendarPage = () => {
  const { serviceId } = useParams(); // Get the serviceId from the URL
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBackClick = () => {
    navigate("/"); // Navigate back to the homepage
  };

  return (
    <div className="calendar-page">
      <div className="header">
        <h1>Service Calendar</h1>
        <button className="back-button" onClick={handleBackClick}>
          &larr; Back
        </button>
      </div>
      <AvailableSlotsCalendar serviceId={serviceId} />
    </div>
  );
};

export default CalendarPage;
