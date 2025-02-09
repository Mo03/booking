import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AvailableSlotsCalendar from "./AvailableSlotsCalendar"; // Reuse this component
import "./CalendarPage.css"; // Import CSS for styling
import { useTenant } from "../TenantContext";
import backIcon from "../assets/backIcon.svg"; // Import the image

const CalendarPage = () => {
  const tenantID = useTenant();

  const { serviceId } = useParams(); // Get the serviceId from the URL
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBackClick = () => {
    navigate("/"); // Navigate back to the homepage
  };

  return (
    <div className="calendar-page">
      <div className="header">
        <button className="back-button" onClick={handleBackClick}>
          <img
            src={backIcon}
            alt="Back"
            style={{ width: "24px", height: "24px" }}
          />
        </button>
        <h4 style={{ marginTop: "13px" }}>{tenantID}</h4>
      </div>
      <AvailableSlotsCalendar serviceId={serviceId} />
    </div>
  );
};

export default CalendarPage;
