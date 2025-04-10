import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/tasks";

// Fetch all tasks with optional filters
export const fetchTasks = async (filters = {}) => {
  try {
    const { status, priority, search } = filters;
    const params = {};
    
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (search) params.search = search;
    
    const res = await axios.get(API_BASE_URL, { params });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const res = await axios.post(API_BASE_URL, taskData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update a task
export const updateTaskById = async ({ id, updatedTask }) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/${id}`, updatedTask);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a task
export const deleteTaskById = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete all tasks
export const clearAllTasks = async () => {
  try {
    const res = await axios.delete(API_BASE_URL);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};