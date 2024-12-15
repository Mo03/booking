import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AvailableSlotsCalendar.css";
import { getAvailableSlots } from "../services/api";
import { useTenant } from "../TenantContext";
import { FaCalendarAlt } from "react-icons/fa"; // Import the calendar icon from react-icons
import Loader from "./common/Loader"; // Add this import

const AvailableSlotsCalendar = ({ serviceId, servicePrice, serviceName }) => {
  const tenantID = useTenant();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (serviceId && tenantID) {
      fetchAvailableSlots(serviceId, tenantID, currentMonth);
    }
  }, [serviceId, tenantID, currentMonth]);

  const fetchAvailableSlots = async (serviceId, tenantID, date) => {
    setLoading(true);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const data = {
      serviceId,
      startDate,
      endDate,
    };

    try {
      const response = await getAvailableSlots(data, tenantID);
      setAvailableSlots(response);
      console.log("Available slots fetched:", response);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setError("Error fetching available slots");
    } finally {
      setLoading(false);
    }
  };

  const isDateAvailable = (date) => {
    return availableSlots.some(
      (slot) => new Date(slot.date).toDateString() === date.toDateString()
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const slot = availableSlots.find(
      (slot) => new Date(slot.date).toDateString() === date.toDateString()
    );
    console.log("Selected slot:", slot);
    setSelectedSlot(slot);
    setSelectedTime(slot ? slot.availableTimes : []);
  };

  const handleMonthChange = ({ activeStartDate }) => {
    console.log("Month changed:", activeStartDate);
    setCurrentMonth(activeStartDate);
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleBookClick = (time) => {
    navigate(`/calendar/${serviceId}/booking`, {
      state: {
        serviceId,
        selectedDate,
        selectedTime: time,
        price: servicePrice,
        serviceName: serviceName,
      },
    });
  };

  return (
    <div className="available-slots-calendar">
      {error && <div className="error">{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <>
          <Calendar
            onChange={handleDateChange}
            onActiveStartDateChange={handleMonthChange}
            tileDisabled={({ date }) => !isDateAvailable(date)}
            value={selectedDate || currentMonth} // Ensure the calendar reflects the current month or selected date
          />
          {selectedDate && selectedTime.length > 0 && (
            <div className="time-slots">
              <h4 style={{ direction: "ltr", color: "#333333" }}>
                <FaCalendarAlt className="calendar-icon" />
                {selectedDate.toDateString()}
              </h4>
              <ul>
                {selectedTime.map((time, index) => (
                  <li
                    key={index}
                    className="time-slot-item"
                    onClick={() => handleBookClick(time)}
                  >
                    {formatTime(time)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvailableSlotsCalendar;
