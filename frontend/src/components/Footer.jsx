import { useSelector, useDispatch } from "react-redux";
import TaskCard from "./Taskcard";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  addTaskToDB,
  deleteTaskFromDB,
  clearTasksFromDB,
  updateTaskInDB,
  fetchTasksFromDB,
  addTaskOptimistically
} from "../store/taskSlice";

const Footer = ({ filters }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);
  const searchQuery = useSelector((state) => state.tasks.searchQuery);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });
  const [warning, setWarning] = useState("");

  useEffect(() => {
    dispatch(fetchTasksFromDB());
  }, [dispatch]);

  useEffect(() => {
    let tempTasks = [...tasks]; 

    if (filters.status) {
      tempTasks = tempTasks.filter((x) => x.status === filters.status);
    }

    if (filters.priority) {
      tempTasks = tempTasks.filter((x) => x.priority === filters.priority);
    }

    if (searchQuery.trim()) {
      tempTasks = tempTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(tempTasks);
  }, [filters, tasks, searchQuery]);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
    setWarning("");
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setWarning("Title is required!");
      return;
    }

    try {
      const tempId = Date.now().toString();
      const tempTask = { ...newTask, _id: tempId };
      
      dispatch(addTaskOptimistically(tempTask));
      
      await dispatch(addTaskToDB(newTask)).unwrap();
      
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
      });
      
      setIsModalOpen(false);
    } catch (err) {
      setWarning(err.message || "Failed to add task");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL tasks? This cannot be undone!")) {
      return;
    }
  
    try {
      await dispatch(clearTasksFromDB()).unwrap();
      setWarning("All tasks deleted successfully");
      setTimeout(() => setWarning(""), 3000); 
    } catch (err) {
      setWarning(err.message || "Failed to delete all tasks");
    }
  };

  return (
    <div className="task-section">
      {/* Scrollable Tasks */}
      <div className="task-list-scrollable d-flex flex-wrap justify-content-center gap-3">
        {loading ? (
          <p className="text-muted text-center mt-3">Loading tasks...</p>
        ) : error ? (
          <p className="text-danger text-center mt-3">{error}</p>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={() => dispatch(deleteTaskFromDB(task._id))}
              onUpdate={(updatedTask) => 
                dispatch(updateTaskInDB({ taskId: task._id, updatedTask }))
              }
            />
          ))
        ) : (
          <p className="text-muted text-center mt-3">No tasks found...</p>
        )}
      </div>

      {/* Footer */}
      <div className="d-flex justify-content-center gap-3 rounded-4 footer">
        <button 
          className="btn btn-light px-4" 
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          {loading ? "Loading..." : "➕ Add Task"}
        </button>
        <button 
           className="btn btn-danger px-4" 
           onClick={handleDeleteAll}
           disabled={loading || tasks.length === 0}
         >
            {loading ? (
          <>
            <FaSpinner className="me-2 fa-spin" />
             Deleting...
          </>
            ) : (
              "🗑️ Delete All"
            )}
        </button>
      </div>

      {/* Task Form pop up */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-center text-primary mb-3">📋 Add New Task</h2>
            {warning && <div className="alert alert-warning mb-3">{warning}</div>}
            <input
              type="text"
              name="title"
              className="form-control mb-2"
              placeholder="Task Title"
              value={newTask.title}
              onChange={handleChange}
            />
            <textarea
              name="description"
              className="form-control mb-2"
              placeholder="Task Description"
              value={newTask.description}
              onChange={handleChange}
            />
            <input
              type="date"
              name="dueDate"
              className="form-control mb-2"
              value={newTask.dueDate}
              onChange={handleChange}
            />
            <select
              name="priority"
              className="form-select mb-2"
              value={newTask.priority}
              onChange={handleChange}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
            <select
              name="status"
              className="form-select mb-2"
              value={newTask.status}
              onChange={handleChange}
            >
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">⚒️ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
            <div className="d-flex justify-content-end gap-2 mt-2">
              <button className="btn btn-success" onClick={handleAddTask}>
                ✅ Save Task
              </button>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;