import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    searchQuery: "", 
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks.splice(action.payload, 1);
    },
    updateTask: (state, action) => {
      const { index, updatedTask } = action.payload;
      state.tasks[index] = updatedTask;
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload; 
    },
  },
});

export const { addTask, deleteTask, updateTask, clearTasks, setSearchQuery } = taskSlice.actions;
export default taskSlice.reducer;
