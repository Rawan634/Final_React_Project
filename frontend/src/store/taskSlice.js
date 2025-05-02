import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/taskApi";

const initialState = {
  tasks: [],
  searchQuery: "",
  loading: false,
  error: null,
};

// Async Thunks
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
  async ({ taskId, updatedTask, originalTask }, { rejectWithValue }) => {
    try {
      const response = await api.updateTask(taskId, updatedTask);
      return { response: response.data, originalTask };
    } catch (err) {
      return rejectWithValue({ error: err.response.data, originalTask });
    }
  }
);

export const deleteTaskFromDB = createAsyncThunk(
  "tasks/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      await api.deleteTask(taskId);
      return taskId;
    } catch (err) {
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
      state.searchQuery = action.payload.toLowerCase(); 
    },
    addTaskOptimistically: (state, action) => {
      state.tasks.push(action.payload);
    },
    removeTaskTemporarily: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    },
    updateTaskOptimistically: (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    readdTask: (state, action) => {
      if (!state.tasks.some(task => task._id === action.payload._id)) {
        state.tasks.push(action.payload);
      }
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
      
      // Add Task
      .addCase(addTaskToDB.pending, (state, action) => {
        const tempTask = {
          ...action.meta.arg,
          _id: action.meta.arg.tempId,
          isOptimistic: true
        };
        state.tasks.push(tempTask);
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
      
      // Update Task
      .addCase(updateTaskInDB.pending, (state, action) => {
        const { taskId, updatedTask } = action.meta.arg;
        const index = state.tasks.findIndex(t => t._id === taskId);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask };
        }
      })
      .addCase(updateTaskInDB.fulfilled, (state, action) => {
        const updatedTask = action.payload.response;
        const index = state.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask; // ✅ Now updates the task in state
        }
      })
      
      .addCase(updateTaskInDB.rejected, (state, action) => {
        const { originalTask } = action.payload;
        const index = state.tasks.findIndex(t => t._id === originalTask._id);
        if (index !== -1) {
          state.tasks[index] = originalTask;
        }
      })
      
      // Delete Task
      .addCase(deleteTaskFromDB.pending, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.meta.arg);
      })
      .addCase(deleteTaskFromDB.rejected, (state, action) => {
        // If you need to re-add the task on failure, you would do it here
        // But you'll need the original task data to do this properly
      })
      
      // Clear Tasks
      .addCase(clearTasksFromDB.fulfilled, (state) => {
        state.tasks = [];
      });
  }
});

// Export all action creators
export const { 
  setSearchQuery,
  addTaskOptimistically,
  removeTaskTemporarily,
  updateTaskOptimistically,
  readdTask
} = taskSlice.actions;

export default taskSlice.reducer;