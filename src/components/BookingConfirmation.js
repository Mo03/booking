import React, { useEffect } from "react";
import dateIcon from "../assets/dateIcon.svg";
import timeIcon from "../assets/timeIcon.svg";
import copyIcon from "../assets/copyIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    tenantID,
    formattedDate,
    formattedTime,
    bookingReference,
    serviceInfo,
  } = location.state || {};

  console.log("BookingConfirmation props:", {
    tenantID,
    formattedDate,
    formattedTime,
    bookingReference,
    serviceInfo,
  });

  useEffect(() => {
    if (!bookingReference) {
      navigate("/");
    }
  }, [bookingReference]);

  const onCopyBookingID = async () => {
    try {
      await navigator.clipboard.writeText(bookingReference);
      alert("تم نسخ رقم الحجز بنجاح");
    } catch (err) {
      console.error("Failed to copy booking reference:", err);
      alert("فشل نسخ رقم الحجز");
    }
  };

  if (!bookingReference) {
    return <div>جاري التحميل...</div>;
  }

  if (!serviceInfo || !serviceInfo.name) {
    console.error("Missing service information");
    return <div>Error: Service information not found</div>;
  }

  return (
    <div className="booking-confirmation" dir="ltr">
      <h2>! تم تأكيد الحجز</h2>
      <h4> {tenantID} مع</h4>
      <p>
        <img
          src={dateIcon}
          alt="Date"
          style={{
            width: "20px",
            marginRight: "8px",
            margin: "0 0 -3px 5px",
          }}
        />
        التاريخ: <span> &nbsp; {formattedDate}</span>
      </p>
      <p>
        <img
          src={timeIcon}
          alt="Time"
          style={{
            width: "20px",
            marginRight: "8px",
            margin: "0 0 -3px 5px",
          }}
        />
        الوقت: <span> &nbsp; {formattedTime}</span>
      </p>
      <p>
        <button
          onClick={onCopyBookingID}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            marginLeft: "8px",
          }}
        >
          <img
            src={copyIcon}
            alt="Copy"
            style={{
              width: "20px",
              height: "20px",
              margin: "0 0 -3px 5px",
            }}
          />
          رقم الحجز: <span> &nbsp; {bookingReference} </span>
        </button>
      </p>
      <p>
        الخدمة: <span> &nbsp; {serviceInfo.name} </span>
      </p>
      <p>
        السعر: <span> &nbsp; {serviceInfo.price} ريال</span>
      </p>
      <p>
        المدة: <span> &nbsp; {serviceInfo.duration} دقيقة</span>
      </p>
    </div>
  );
};

export default BookingConfirmation;
