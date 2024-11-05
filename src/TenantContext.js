import React, { createContext, useContext } from "react";

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const tenantID = "testty"; // Hardcoded tenantID for testing
  return (
    <TenantContext.Provider value={tenantID}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => {
  return useContext(TenantContext);
};
