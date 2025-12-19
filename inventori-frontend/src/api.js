// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://inventori-backend-108371083602.us-central1.run.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
