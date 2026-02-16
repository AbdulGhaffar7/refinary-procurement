import axios from "axios";
import { BASE_URL_CATALOG } from "../utils/config.js";

const apiClient = axios.create({
  baseURL: BASE_URL_CATALOG,
  headers: {
    "Content-Type": "application/json",
  },
  transformResponse: [
    (data) => {
      try {
        return JSON.parse(data);
      } catch (error) {
        return data;
      }
    },
  ],
});

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "Invalid request data. Please check your input.";
          break;
        case 404:
          error.message = "Resource not found.";
          break;
        case 500:
          error.message = "Server error. Please try again later.";
          break;
        default:
          error.message = error.response.data?.message || "An error occurred";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
