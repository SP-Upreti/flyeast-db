import axios from "axios";

// Use production API URL in production, proxy in development
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? '/api' 
  : 'https://flyeastapi.webxnepal.com/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = accessToken;
  }

  // Don't set Content-Type for FormData, let the browser set it with the correct boundary
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  // Debug logs
  console.log("API Request Interceptor - Config data:", config.data);
  console.log("API Request Interceptor - Config URL:", config.url);
  console.log("API Request Interceptor - Config method:", config.method);

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("API Response Interceptor - Response data:", response.data);
    console.log("API Response Interceptor - Response URL:", response.config.url);
    return response;
  },
  (error) => {
    console.error("API Response Interceptor - Error:", error);

    // If unauthorized, redirect to login
    if (error.response && error.response.status === 401) {
      window.location.href = "/"; // redirect to login page
      alert("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);
