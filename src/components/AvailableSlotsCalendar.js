import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles for the calendar
import "./AvailableSlotsCalendar.css"; // Import your custom styles
import { getAvailableSlots } from "../services/api"; // Assume this function makes the API call

const AvailableSlotsCalendar = ({ serviceId }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (serviceId) {
      fetchAvailableSlots(serviceId);
    }
  }, [serviceId]);

  const fetchAvailableSlots = async (serviceId) => {
    setLoading(true);
    const data = {
      serviceId,
      startDate: "2024-07-13",
      endDate: "2024-07-23",
    };
    try {
      const response = await getAvailableSlots(data, "tested");
      setAvailableSlots(response);
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
    setSelectedTime(slot ? slot.availableTimes : []);
  };

  return (
    <div className="available-slots-calendar">
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Loading calendar...</div>
      ) : (
        <>
          <Calendar
            onChange={handleDateChange}
            tileDisabled={({ date }) => !isDateAvailable(date)}
            value={selectedDate}
          />
          {selectedDate && selectedTime.length > 0 && (
            <div className="time-slots">
              <h3>Available Times for {selectedDate.toDateString()}</h3>
              <ul>
                {selectedTime.map((time, index) => (
                  <li key={index}>{time}</li>
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
