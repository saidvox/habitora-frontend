import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Initialize Authorization header from persisted token (if any)
try {
  const token = localStorage.getItem("habitora-access-token");
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
} catch (e) {
  // ignore
}

export default axiosInstance;