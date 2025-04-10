import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/tasks";

export const fetchTasks = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await axios.post(API_BASE_URL, taskData);
  return res.data;
};

export const deleteTaskById = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const updateTaskById = async ({ id, updatedTask }) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, updatedTask);
  return res.data;
};
