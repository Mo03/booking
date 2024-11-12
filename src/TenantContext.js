import React, { createContext, useContext } from "react";
import { useTenantIDFromSubdomain as useTenantID } from "./hooks/useTenantID";

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const tenantID = useTenantID();
  return (
    <TenantContext.Provider value={tenantID}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => {
  return useContext(TenantContext);
};
