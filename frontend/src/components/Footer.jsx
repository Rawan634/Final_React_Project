import { useSelector, useDispatch } from "react-redux";
import { addTask, deleteTask, clearTasks, updateTask } from "../store/taskSlice";
import TaskCard from "./Taskcard";
import { useEffect, useState } from "react";

const Footer = ({ filters }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const searchQuery = useSelector((state) => state.tasks.searchQuery); 
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" });

  useEffect(() => {
    let tempTasks = tasks;

    // Apply filters
    if (filters.status) tempTasks = tempTasks.filter((x) => x.status === filters.status);
    if (filters.priority) tempTasks = tempTasks.filter((x) => x.priority === filters.priority);

    // Apply search filter
    if (searchQuery.trim()) {
      tempTasks = tempTasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredTasks(tempTasks);
  }, [filters, tasks, searchQuery]); 

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    console.log("Adding task:", newTask); 
    
    dispatch(addTask(newTask));
  
    setNewTask({ title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" });
    setIsModalOpen(false);
  };
  

  return (
    <div className="container mt-4">
      {/* Task List */}
      <div className="mt-4 d-flex flex-wrap justify-content-center gap-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <TaskCard key={index} task={task} onDelete={() => dispatch(deleteTask(index))} onUpdate={(updatedTask) => dispatch(updateTask({ index, updatedTask }))} />
          ))
        ) : (
          <p className="text-muted text-center mt-3">No tasks found...</p>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="d-flex justify-content-center gap-3 mt-4 bg-primary text-white p-4 rounded-4 header">
        <button className="btn btn-light px-4" onClick={() => setIsModalOpen(true)}>➕ Add Task</button>
        <button className="btn btn-danger px-4" onClick={() => dispatch(clearTasks())}>🗑️ Delete All</button>
      </div>

      {/* Task Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-center text-primary mb-3">📋 Add New Task</h2>
            <input type="text" name="title" className="form-control mb-2" placeholder="Task Title" value={newTask.title} onChange={handleChange} />
            <textarea name="description" className="form-control mb-2" placeholder="Task Description" value={newTask.description} onChange={handleChange} />
            <input type="date" name="dueDate" className="form-control mb-2" value={newTask.dueDate} onChange={handleChange} />
            <select name="priority" className="form-select mb-2" value={newTask.priority} onChange={handleChange}>
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
            <select name="status" className="form-select mb-2" value={newTask.status} onChange={handleChange}>
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">⚒️ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
            <div className="d-flex justify-content-end gap-2 mt-2">
              <button className="btn btn-success" onClick={handleAddTask}>✅ Save Task</button>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
