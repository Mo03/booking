import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoriesWithServices } from "../services/api";
import AvailableSlotsCalendar from "./AvailableSlotsCalendar";
import CategoryFilter from "./CategoryFilter";
import ServiceList from "./ServiceList";
import "./HomePage.css";
import { useTenant } from "../TenantContext";

const HomePage = () => {
  const tenantID = useTenant();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({ name: "الكل" });
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchCategoriesAndServices();
  }, []);

  const fetchCategoriesAndServices = async () => {
    setLoading(true);
    try {
      const data = await getCategoriesWithServices(tenantID);
      setCategories(data);
      const allServices = data.flatMap((category) =>
        category.services.map((service) => ({
          ...service,
          categoryName: category.name,
        }))
      );
      setServices(allServices);
      setFilteredServices(allServices);
    } catch (error) {
      console.error("Error fetching categories and services:", error);
      setError("Error fetching categories and services");
    } finally {
      setLoading(false);
    }
  };

  const filterServicesByCategory = (category) => {
    setSelectedCategory(category);
    if (category.name === "الكل") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) => service.categoryName === category.name
      );
      setFilteredServices(filtered);
    }
  };

  const handleBook = (service) => {
    navigate(`/calendar/${service.id}`); // Navigate to calendar page with service ID
  };

  const handleSelectService = (serviceId) => {
    setSelectedServiceId(serviceId);
  };

  return (
    <div className="home-page">
      <h1>{tenantID}</h1>
      {error && <div className="error">{error}</div>}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={filterServicesByCategory}
      />
      <div className="section">
        <h2 className="category-title">{selectedCategory.name}</h2>
        {loading ? (
          <div>Loading services...</div>
        ) : (
          <ServiceList
            services={filteredServices}
            onBook={handleBook}
            onSelectService={handleSelectService}
          />
        )}
      </div>
      {selectedServiceId && (
        <AvailableSlotsCalendar serviceId={selectedServiceId} />
      )}
    </div>
  );
};

export default HomePage;
