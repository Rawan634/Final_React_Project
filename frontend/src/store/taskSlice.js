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
const generateTempId = () => `temp-${[...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export const addTaskToDB = createAsyncThunk(
  "tasks/add",
  async (task, { rejectWithValue, dispatch }) => {
    try {
      const tempId = generateTempId();
      const tempTask = { ...task, _id: tempId, isOptimistic: true };

      // Optimistically add to state
      dispatch(addTaskOptimistically(tempTask));

      const response = await api.createTask(task); // Send without temp ID
      return { ...response.data, tempId };
    } catch (err) {
      // Remove the temporary task if creation fails
      dispatch(removeTaskTemporarily(tempId));
      return rejectWithValue(err.response.data);
    }
  }
);


export const updateTaskInDB = createAsyncThunk(
  "tasks/update",
  async ({ taskId, updatedTask }, { rejectWithValue, getState }) => {
    try {
      // Find the original task for rollback
      const originalTask = getState().tasks.tasks.find(t => t._id === taskId);
      
      const response = await api.updateTask(taskId, updatedTask);
      return {
        updatedTask: response.data,
        originalTask
      };
    } catch (err) {
      return rejectWithValue({
        msg: err.response?.data?.msg || "Update failed",
        error: err.message,
        taskId,
        updatedTask
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
      
      .addCase(addTaskToDB.fulfilled, (state, action) => {
        const { tempId, ...realTask } = action.payload;
        const index = state.tasks.findIndex(task => task._id === tempId);
        
        if (index !== -1) {
          // Replace temporary task with real one
          state.tasks[index] = realTask;
        }
        // Don't add again - we already have either the temp or real version
      })
      
      .addCase(addTaskToDB.rejected, (state, action) => {
        // Remove the temporary task if creation failed
        state.tasks = state.tasks.filter(
          task => task._id !== action.meta.arg._id
        );
      })
      
      // Update Task
      .addCase(updateTaskInDB.pending, (state, action) => {
        const { taskId, updatedTask } = action.meta.arg;
        const index = state.tasks.findIndex(t => t._id === taskId);
        
        if (index !== -1) {
          state.tasks[index] = {
            ...state.tasks[index],
            ...updatedTask,
            isUpdating: true
          };
        }
      })
      // In your extraReducers, modify the updateTaskInDB.fulfilled case:
      .addCase(updateTaskInDB.fulfilled, (state, action) => {
        const { updatedTask } = action.payload;
        const index = state.tasks.findIndex(t => t._id === updatedTask._id);
        
        if (index !== -1) {
          state.tasks[index] = {
            ...updatedTask,
            isUpdating: false
          };
        } else {
          // If task not found (shouldn't happen), add it
          state.tasks.push(updatedTask);
        }
      })
      .addCase(updateTaskInDB.rejected, (state, action) => {
        const { taskId, originalTask } = action.payload;
        const index = state.tasks.findIndex(t => t._id === taskId);
        
        if (index !== -1 && originalTask) {
          state.tasks[index] = originalTask;
        }
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