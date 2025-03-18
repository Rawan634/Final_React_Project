
import { useState } from "react";
import TaskCard from "./Taskcard";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" });

  // Handle Input Change
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Add New Task (Add to Beginning)
  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks([newTask, ...tasks]); // Now tasks will appear at the top
    setNewTask({ title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" });
  };

  // Delete Task
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Update Task
  const updateTask = (updatedTask, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);
  };

  return (
    <div className="container mt-4">
      {/* 🔹 Task List (Rendered Above Input Section) */}
      <div className="mt-4">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskCard key={index} task={task} onDelete={() => deleteTask(index)} onUpdate={(updatedTask) => updateTask(updatedTask, index)} />
          ))
        ) : (
          <p className="text-muted text-center mt-3">No tasks found...</p>
        )}
      </div>

      {/* 🔹 Task Input Section (Below Task List) */}
      <div className="card shadow-lg p-4 mt-3">
        <h2 className="text-center text-primary mb-3">📋 Task Manager</h2>
        <div className="row g-3">
          <div className="col-md-6">
            <input type="text" name="title" className="form-control" placeholder="Task Title" value={newTask.title} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <input type="text" name="description" className="form-control" placeholder="Task Description" value={newTask.description} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <input type="date" name="dueDate" className="form-control" value={newTask.dueDate} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <select name="priority" className="form-select" value={newTask.priority} onChange={handleChange}>
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>
          <div className="col-md-4">
            <select name="status" className="form-select" value={newTask.status} onChange={handleChange}>
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">⚒️ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary w-100 mt-3" onClick={addTask}>➕ Add Task</button>
      </div>

      {tasks.length > 0 && (
        <button className="btn btn-danger w-100 mt-3" onClick={() => setTasks([])}>🗑️ Delete All</button>
      )}
    </div>
  );
};

export default Footer;
