import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../api/taskApi"

const initialState = {
  tasks: [],
  deletedTasks: [], 
  searchQuery: "",
  loading: false,
  error: null,
}

// Async Thunks
export const fetchTasksFromDB = createAsyncThunk("tasks/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.fetchTasks()
    return response.data
  } catch (err) {
    return rejectWithValue(err.message || "Failed to fetch tasks")
  }
})

const generateTempId = () => `temp-${[...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`

export const addTaskToDB = createAsyncThunk("tasks/add", async (task, { rejectWithValue, dispatch }) => {
  try {
    const tempId = generateTempId()
    const tempTask = { ...task, _id: tempId, isOptimistic: true }

    dispatch(addTaskOptimistically(tempTask))

    const response = await api.createTask(task) 
    return { ...response.data, tempId }
  } catch (err) {
    dispatch(removeTaskTemporarily(generateTempId()))
    return rejectWithValue(err.message || "Failed to add task")
  }
})

export const updateTaskInDB = createAsyncThunk(
  "tasks/update",
  async ({ taskId, updatedTask, originalTask }, { rejectWithValue, getState }) => {
    try {
      if (!originalTask) {
        originalTask = getState().tasks.tasks.find((t) => t._id === taskId)
      }

      const response = await api.updateTask(taskId, updatedTask)
      return {
        updatedTask: response.data,
        originalTask,
      }
    } catch (err) {
      return rejectWithValue({
        msg: err.message || "Update failed",
        taskId,
        updatedTask,
        originalTask,
      })
    }
  },
)

export const deleteTaskFromDB = createAsyncThunk("tasks/delete", async (taskId, { rejectWithValue }) => {
  try {
    await api.deleteTask(taskId)
    return { taskId }
  } catch (err) {
    return rejectWithValue(err.message || "Failed to delete task")
  }
})

export const clearTasksFromDB = createAsyncThunk("tasks/clear", async (_, { rejectWithValue, getState, dispatch }) => {
  try {
    const tasksToDelete = [...getState().tasks.tasks]
    if (tasksToDelete.length > 0) {
      dispatch(storeAllDeletedTasks(tasksToDelete))
    }
    await api.clearTasks()
    return tasksToDelete
  } catch (err) {
    return rejectWithValue(err.message || "Failed to clear tasks")
  }
})

export const addTaskToFavorites = createAsyncThunk("tasks/addToFavorites", async (taskId, { rejectWithValue }) => {
  try {
    const response = await api.addToFavorites(taskId)
    return response.data
  } catch (err) {
    return rejectWithValue(err.message || "Failed to add to favorites")
  }
})

export const removeTaskFromFavorites = createAsyncThunk(
  "tasks/removeFromFavorites",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.removeFromFavorites(taskId)
      return response.data
    } catch (err) {
      return rejectWithValue(err.message || "Failed to remove from favorites")
    }
  },
)

export const restoreDeletedTask = createAsyncThunk(
  "tasks/restoreDeleted",
  async (task, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState()
      const exists = state.tasks.tasks.some((t) => t._id === task._id)
      if (exists) {
        return rejectWithValue("Task already exists")
      }

      dispatch({ type: "tasks/removeFromDeletedTasks", payload: task._id })

      if (!task._id.startsWith("temp-")) {
        const response = await api.createTask({
          ...task,
          isRestored: true, 
        })
        return response.data
      }
      return { ...task, isRestored: true }
    } catch (err) {
      return rejectWithValue(err.message || "Failed to restore task")
    }
  },
)

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload.toLowerCase()
    },
    addTaskOptimistically: (state, action) => {
      if (!state.tasks.some((task) => task._id === action.payload._id)) {
        state.tasks.push(action.payload)
      }
    },
    removeTaskTemporarily: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload)
    },
    updateTaskOptimistically: (state, action) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    readdTask: (state, action) => {
      if (!state.tasks.some((task) => task._id === action.payload._id)) {
        state.tasks.push(action.payload)
      }
    },
    undoDeletedTask: (state) => {
      if (state.deletedTasks.length > 0) {
        const taskToRestore = state.deletedTasks[0]
        state.deletedTasks = state.deletedTasks.slice(1)

        if (!state.tasks.some((t) => t._id === taskToRestore._id)) {
          state.tasks.push({
            ...taskToRestore,
            isRestored: true, 
          })
        }
      }
    },

    storeDeletedTask: (state, action) => {
      state.deletedTasks.unshift(action.payload)
    },

    storeAllDeletedTasks: (state, action) => {
      state.deletedTasks = [...action.payload.reverse(), ...state.deletedTasks]
    },
    clearDeletedTasks: (state) => {
      state.deletedTasks = []
    },
    removeFromDeletedTasks: (state, action) => {
      state.deletedTasks = state.deletedTasks.filter((task) => task._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksFromDB.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasksFromDB.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasksFromDB.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch tasks"
      })

      .addCase(addTaskToDB.fulfilled, (state, action) => {
        const { tempId, ...realTask } = action.payload
        const index = state.tasks.findIndex((task) => task._id === tempId)

        if (index !== -1) {
          state.tasks[index] = realTask
        }
      })

      .addCase(addTaskToDB.rejected, (state, action) => {
        const tempId = generateTempId()
        state.tasks = state.tasks.filter((task) => task._id !== tempId)
      })

      .addCase(updateTaskInDB.pending, (state, action) => {
        const { taskId, updatedTask } = action.meta.arg
        const index = state.tasks.findIndex((t) => t._id === taskId)

        if (index !== -1) {
          state.tasks[index] = {
            ...state.tasks[index],
            ...updatedTask,
            isUpdating: true,
          }
        }
      })
      .addCase(updateTaskInDB.fulfilled, (state, action) => {
        const { updatedTask } = action.payload
        const index = state.tasks.findIndex((t) => t._id === updatedTask._id)

        if (index !== -1) {
          state.tasks[index] = {
            ...updatedTask,
            isUpdating: false,
          }
        } else {
          state.tasks.push(updatedTask)
        }
      })
      .addCase(updateTaskInDB.rejected, (state, action) => {
        if (action.payload) {
          const { taskId, originalTask } = action.payload
          const index = state.tasks.findIndex((t) => t._id === taskId)

          if (index !== -1 && originalTask) {
            state.tasks[index] = originalTask
          }
        }
      })
      .addCase(deleteTaskFromDB.pending, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.meta.arg)
      })
      .addCase(deleteTaskFromDB.rejected, (state, action) => {
        if (state.deletedTasks.length > 0) {
          const taskToRestore = state.deletedTasks[0]
          state.deletedTasks = state.deletedTasks.slice(1)
          state.tasks.push(taskToRestore)
        }
      })

      .addCase(clearTasksFromDB.fulfilled, (state, action) => {
        state.tasks = []
      })

      .addCase(addTaskToFavorites.fulfilled, (state, action) => {
        const favoritedTask = action.payload
        const index = state.tasks.findIndex((t) => t._id === favoritedTask._id)
        if (index !== -1) {
          state.tasks[index] = favoritedTask
        }
      })

      .addCase(removeTaskFromFavorites.fulfilled, (state, action) => {
        const unfavoritedTask = action.payload
        const index = state.tasks.findIndex((t) => t._id === unfavoritedTask._id)
        if (index !== -1) {
          state.tasks[index] = unfavoritedTask
        }
      })

      .addCase(restoreDeletedTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
      })
  },
})

export const {
  setSearchQuery,
  addTaskOptimistically,
  removeTaskTemporarily,
  updateTaskOptimistically,
  readdTask,
  storeDeletedTask,
  storeAllDeletedTasks,
  undoDeletedTask,
  clearDeletedTasks,
  removeFromDeletedTasks,
} = taskSlice.actions

export default taskSlice.reducer






