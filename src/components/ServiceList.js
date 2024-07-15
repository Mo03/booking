import React from "react";

const ServiceList = ({ services, onBook }) => (
  <ul>
    {services.map((service, index) => (
      <li key={index} className="service-item">
        <div>
          {service.name}
          <br />
          <div className="service-details">
            <div className="service-price">{`${service.price} ريال`}</div>
            <div className="service-duration">{`${service.duration} دقيقة`}</div>
          </div>
        </div>
        <button onClick={() => onBook(service)} className="book-button">
          أحجز
        </button>
      </li>
    ))}
  </ul>
);

export default ServiceList;
