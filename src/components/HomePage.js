import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoriesWithServices } from "../services/api";
import AvailableSlotsCalendar from "./AvailableSlotsCalendar";
import CategoryFilter from "./CategoryFilter";
import ServiceList from "./ServiceList";
import "./HomePage.css";
import { useTenant } from "../TenantContext";
import Loader from "./common/Loader";

const HomePage = () => {
  const tenantID = useTenant();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({ name: "الكل" });
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (tenantID) {
      fetchCategoriesAndServices();
    }
  }, [tenantID]);

  const fetchCategoriesAndServices = async () => {
    setLoading(true);
    try {
      const data = await getCategoriesWithServices(tenantID);
      setCategories(data);
      const allServices = data.flatMap((category) => category.services || []);
      setServices(allServices);
    } catch (error) {
      console.error("Error fetching categories and services:", error);
      setError(error.message || "Error fetching categories and services");
    } finally {
      setLoading(false);
    }
  };

  const filterServicesByCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleBook = (service) => {
    navigate(`/calendar/${service.id}`, {
      state: { servicePrice: service.price },
    });
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
        {loading ? (
          <Loader />
        ) : (
          <ServiceList
            categories={categories}
            services={services}
            onBook={handleBook}
            selectedCategory={selectedCategory}
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
