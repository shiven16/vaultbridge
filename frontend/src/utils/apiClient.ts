import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Don't auto-redirect if the 401 came from the /auth/me check itself,
    // otherwise it causes an infinite reload loop!
    if (error.response?.status === 401 && originalRequest.url !== "/auth/me") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
