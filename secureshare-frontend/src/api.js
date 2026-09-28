import axios from "axios";

const API = axios.create({
  baseURL: "/api", // No more localhost or IP needed!
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) =>
  API.post("/auth/login", { email, password });

export const register = (fullName, email, password) =>
  API.post("/auth/register", { fullName, email, password });

// Files
export const getMyFiles = () => API.get("/files");
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const downloadFile = (fileId) => API.get(`/files/${fileId}/download`);
export const renameFile = (fileId, newName) =>
  API.patch(`/files/${fileId}/rename`, { newName });
export const deleteFile = (fileId) => API.delete(`/files/${fileId}`);

// Share
export const shareFile = (fileId, email, permission) =>
  API.post("/share", { fileId, email, permission });
export const getSharedFiles = () => API.get("/share");

// Dashboard
export const getDashboardStats = () => API.get("/dashboard/stats");

// Profile
export const getProfile = () => API.get("/profile");

// Settings
export const getSettings = () => API.get("/profile/settings");
export const updateSettings = (settings) =>
  API.patch("/profile/settings", settings);

export default API;