import React from "react";

const ServiceList = ({ categories, services, onBook, selectedCategory }) => {
  const filteredServices =
    selectedCategory.name === "الكل"
      ? services
      : services.filter(
          (service) => service.category === selectedCategory.name
        );

  return (
    <div>
      {categories.map((category) => {
        const categoryServices = category.services || [];
        if (
          selectedCategory.name === "الكل" ||
          selectedCategory.name === category.name
        ) {
          return (
            <div key={category.name} className="category-section">
              <h3 className="category-title">{category.name}</h3>
              <ul>
                {categoryServices.map((service) => (
                  <li
                    key={service.id}
                    className="service-item"
                    onClick={() =>
                      onBook({
                        id: service.id,
                        price: service.price,
                        name: service.name,
                      })
                    }
                  >
                    <div className="service-details">
                      <span>{service.name}</span>
                      <span>{service.price} ريال</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ServiceList;
