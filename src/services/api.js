import axios from "axios";

const baseURL = "http://localhost:5219/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const withAuthHeaders = (tenantID, jwtToken, additionalHeaders = {}) => ({
  headers: {
    accept: "*/*",
    "Content-Type": "application/json",
    "X-Tenant-ID": tenantID,
    Authorization: `Bearer ${jwtToken}`,
    ...additionalHeaders,
  },
});

const handleRequest = async (
  method,
  url,
  data,
  jwtToken,
  tenantID,
  additionalHeaders = {}
) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...withAuthHeaders(tenantID, jwtToken, additionalHeaders),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCategories = async (jwtToken) => {
  return handleRequest("get", "/Categories", null, jwtToken);
};

export const getServices = async (jwtToken) => {
  return handleRequest("get", "/Services", null, jwtToken);
};

export const getCategoriesWithServices = async (tenantID) => {
  console.log("getCategoriesWithServices", tenantID);
  return handleRequest("get", "/Categories/services", null, null, tenantID);
};
