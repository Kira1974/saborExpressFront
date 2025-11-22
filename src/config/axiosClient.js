import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para adjuntar el Token en las peticiones que lo requieran
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
