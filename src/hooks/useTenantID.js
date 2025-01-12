import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getExists } from "../services/api";

export const useTenantIDFromSubdomain = () => {
  const navigate = useNavigate();
  const [tenantID, setTenantID] = useState(null);

  useEffect(() => {
    const getTenantID = async () => {
      const { hostname } = window.location;
      //const hostname = "test.localhost:3000";
      // test.localhost:3000

      console.log("hostname ------>>>> ", hostname);
      const tenant = hostname.split(".")[0];
      console.log("tenant ------>>>> ", tenant);

      try {
        const exists = await getExists(tenant);
        console.log("exists ------>>>> ", exists.exists);
        if (exists.exists == false) {
          handleNonExistentTenant(tenant);
        } else {
          console.log(`Tenant ID ${tenant} exists.`);
          setTenantID(tenant);
        }
      } catch (error) {
        console.error("Error checking tenant ID existence:", error);
        handleNonExistentTenant(tenant);
      }
    };

    getTenantID();
  }, [navigate]);

  const handleNonExistentTenant = (tenant) => {
    console.log(`Tenant ID ${tenant} does not exist. Redirecting to 404 page.`);
    navigate("/404");
  };

  return tenantID;
};
