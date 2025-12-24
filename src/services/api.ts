import axios from "axios";

const isProduction = import.meta.env.PROD;

export const api = axios.create({
  baseURL: isProduction ? `/api` : `/api`,
  withCredentials: !isProduction, // Only for local dev
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


  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/"; // redirect to login page
      alert("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);
