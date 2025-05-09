import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/tasks" });

// checks for token directly
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


export const fetchTasks = () => API.get("/");
export const createTask = (taskData) => API.post("/add", taskData);
export const updateTask = (taskId, updatedTask) => {
  return API.put(`/${taskId}`, updatedTask); 
};
export const deleteTask = (taskId) => API.delete(`/${taskId}`);
export const clearTasks = () => API.delete("/");
export const addToFavorites = (taskId) => API.put(`/${taskId}/favorite`);
export const removeFromFavorites = (taskId) => API.put(`/${taskId}/unfavorite`);
