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
      // Generate a proper temporary ID
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const tempTask = { ...task, _id: tempId, isOptimistic: true };
      
      const response = await api.createTask(tempTask);
      return { ...response.data, tempId }; // Pass both IDs
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateTaskInDB = createAsyncThunk(
  "tasks/update",
  async ({ taskId, updatedTask, originalTask }, { rejectWithValue }) => { 
    try {
      // Validate ID format before making the request
      if (!taskId || typeof taskId !== 'string') {
        throw new Error("Invalid task ID format");
      }

      const response = await api.updateTask(taskId, updatedTask);
      return {
        updatedTask: response.data,
        originalTaskId: taskId // For fallback if update fails
      };
    } catch (err) {
      return rejectWithValue({
        msg: err.response?.data?.msg || "Failed to update task",
        originalTask // For optimistic rollback
      });
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
export const addTaskToFavorites = createAsyncThunk(
  "tasks/addToFavorites",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.addToFavorites(taskId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeTaskFromFavorites = createAsyncThunk(
  "tasks/removeFromFavorites",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.removeFromFavorites(taskId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
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
      if (!state.tasks.some(task => task._id === action.payload._id)) {
        state.tasks.push(action.payload);
      }
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
        
      })
      .addCase(addTaskToDB.fulfilled, (state, action) => {
        const { tempId, ...realTask } = action.payload;
        state.tasks = state.tasks.filter(task => task._id !== tempId);
        state.tasks.push(realTask);
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
          // Store original task for potential rollback
          state.tasks[index] = {
            ...state.tasks[index],
            ...updatedTask,
            _originalData: state.tasks[index], // Backup
            isOptimistic: true
          };
        }
      })
      .addCase(updateTaskInDB.fulfilled, (state, action) => {
        const updatedTask = action.payload.updatedTask;
        const index = state.tasks.findIndex(t => t._id === updatedTask._id);
        
        if (index !== -1) {
          state.tasks[index] = {
            ...state.tasks[index],
            ...updatedTask,
            isOptimistic: false
          };
        }
        state.loading = false;
      })
      .addCase(updateTaskInDB.rejected, (state, action) => {
        const { taskId } = action.meta.arg;
        const error = action.payload;
        
        // Revert to original task data
        const index = state.tasks.findIndex(t => t._id === taskId);
        if (index !== -1 && state.tasks[index]._originalData) {
          state.tasks[index] = action.payload.originalTask;
        }
        
        state.error = error.msg;
      })
      // Delete Task
      .addCase(deleteTaskFromDB.pending, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.meta.arg);
      })
      .addCase(deleteTaskFromDB.rejected, (state, action) => {
      })
      
      // Clear Tasks
      .addCase(clearTasksFromDB.fulfilled, (state) => {
        state.tasks = [];
      })
      
      // Add to Favorites
      .addCase(addTaskToFavorites.fulfilled, (state, action) => {
        const favoritedTask = action.payload;
        const index = state.tasks.findIndex(t => t._id === favoritedTask._id);
        if (index !== -1) {
          state.tasks[index] = favoritedTask;
        }
      })
      
      // Remove from Favorites
      .addCase(removeTaskFromFavorites.fulfilled, (state, action) => {
        const unfavoritedTask = action.payload;
        const index = state.tasks.findIndex(t => t._id === unfavoritedTask._id);
        if (index !== -1) {
          state.tasks[index] = unfavoritedTask;
        }
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