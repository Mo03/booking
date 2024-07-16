import React, { createContext, useContext } from "react";
import { getTenantIDFromSubdomain } from "./utils/subdomain";

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  //   const tenantID = getTenantIDFromSubdomain();
  const tenantID = "HAR";
  return (
    <TenantContext.Provider value={tenantID}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => {
  return useContext(TenantContext);
};
