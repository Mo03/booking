import React from "react";

const ServiceList = ({ categories, onBook, selectedCategory }) => {
  // If "الكل" is selected, show all categories and their services
  if (selectedCategory.name === "الكل") {
    return (
      <div>
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            <h3 className="category-title">{category.name}</h3>
            <ul>
              {category.services.map((service) => (
                <li
                  key={service.id}
                  onClick={() => onBook(service)}
                  className="service-item"
                >
                  <div className="service-details">
                    <span>{service.name}</span>
                    <span className="service-price">{service.price} ريال</span>
                    <span className="service-duration">
                      {service.duration} دقيقة
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // For specific category, show only its services
  const selectedCategoryData = categories.find(
    (cat) => cat.name === selectedCategory.name
  );

  return (
    <div className="category-section">
      <ul>
        {selectedCategoryData?.services.map((service) => (
          <li
            key={service.id}
            onClick={() => onBook(service)}
            className="service-item"
          >
            <div className="service-details">
              <span>{service.name}</span>
              <span className="service-price">{service.price} ريال</span>
              <span className="service-duration">{service.duration} دقيقة</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
