// src/store/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/taskApi";

const initialState = {
  tasks: [],
  searchQuery: "",
  loading: false,
  error: null,
};

export const fetchTasksFromDB = createAsyncThunk(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetchTasks();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addTaskToDB = createAsyncThunk(
  "tasks/add",
  async (task, { rejectWithValue }) => {
    try {
      const response = await api.createTask(task);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateTaskInDB = createAsyncThunk(
  "tasks/update",
  async ({ taskId, updatedTask }, { rejectWithValue }) => {
    try {
      const response = await api.updateTask(taskId, updatedTask);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteTaskFromDB = createAsyncThunk(
  "tasks/delete",
  async (taskId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.deleteTask(taskId);
      return taskId; // Return the ID for the reducer to use
    } catch (err) {
      // Re-add the task optimistically if the delete fails
      dispatch(taskSlice.actions.readdTask(taskId));
      return rejectWithValue(err.response.data);
    }
  }
);

export const clearTasksFromDB = createAsyncThunk(
  "tasks/clear",
  async (_, { rejectWithValue }) => {
    try {
      await api.clearTasks();
      return []; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addTaskOptimistically: (state, action) => {
      state.tasks.push(action.payload);
    },
    removeTaskTemporarily: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasksFromDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksFromDB.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksFromDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Failed to fetch tasks";
      })
      
      // Add Task (optimistic updates)
      .addCase(addTaskToDB.pending, (state, action) => {
        // Loading handled by optimistic update
      })
      .addCase(addTaskToDB.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.meta.arg.tempId);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(addTaskToDB.rejected, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.meta.arg.tempId);
        state.error = action.payload?.msg || "Failed to add task";
      })
      
      // Delete Task
      .addCase(deleteTaskFromDB.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      
      // Update Task
      .addCase(updateTaskInDB.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) state.tasks[index] = action.payload;
      })
      
      // Clear Tasks
      .addCase(clearTasksFromDB.fulfilled, (state) => {
        state.tasks = [];
      });
  },
});

export const { 
  setSearchQuery, 
  addTaskOptimistically,
  removeTaskTemporarily
} = taskSlice.actions;
export default taskSlice.reducer;