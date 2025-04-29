import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  FaPlus, 
  FaTrash, 
  FaExclamationTriangle, 
  FaExclamationCircle, 
  FaArrowDown,
  FaSpinner
} from "react-icons/fa";
import { addTaskOptimistically, addTaskToDB, clearTasksFromDB } from "../store/taskSlice";

const Sidebar = ({ priority, setPriority }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });
  const [warning, setWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const togglePriority = (newPriority) => {
    setPriority(newPriority === priority ? '' : newPriority);
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
    setWarning("");
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setWarning("Title is required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const tempId = Date.now().toString();
      const tempTask = { ...newTask, _id: tempId };
      
      // Optimistic update
      dispatch(addTaskOptimistically(tempTask));
      
      // API call with tempId
      await dispatch(addTaskToDB({ ...newTask, tempId })).unwrap();
      
      // Reset form
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL tasks?")) return;

    setIsDeleting(true);
    try {
      await dispatch(clearTasksFromDB()).unwrap();
    } catch (err) {
      setWarning(err.message || "Failed to delete tasks");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-3 vh-100 d-flex flex-column">
      {/* Priority Section */}
      <div className="mb-auto">
        <h5 className="text-center mb-4 fs-4 fw-bold">Priority</h5>
        <div className="d-flex flex-column gap-2">
          <button 
            className={`btn btn-outline-danger fs-5 d-flex align-items-center gap-2 mb-2 ${priority === 'High' ? 'bg-danger text-white' : ''}`} 
            onClick={() => togglePriority('High')}
          >
            <FaExclamationTriangle /> <span>High</span>
          </button>
          <button 
            className={`btn btn-outline-warning fs-5 d-flex align-items-center gap-2 mb-2 ${priority === 'Medium' ? 'bg-warning text-white' : ''}`} 
            onClick={() => togglePriority('Medium')}
          >
            <FaExclamationCircle /> <span>Medium</span>
          </button>
          <button 
            className={`btn btn-outline-success fs-5 d-flex align-items-center gap-2 mb-2 ${priority === 'Low' ? 'bg-success text-white' : ''}`} 
            onClick={() => togglePriority('Low')}
          >
            <FaArrowDown /> <span>Low</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto d-flex flex-column gap-2">
        <button 
          className="btn btn-primary d-flex align-items-center gap-2 justify-content-center"
          onClick={() => setIsModalOpen(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <FaSpinner className="fa-spin" /> : <><FaPlus /> Add Task</>}
        </button>
        <button 
          className="btn btn-outline-danger d-flex align-items-center gap-2 justify-content-center"
          onClick={handleDeleteAll}
          disabled={isDeleting}
        >
          {isDeleting ? <FaSpinner className="fa-spin" /> : <><FaTrash /> Delete All</>}
        </button>
      </div>

      {/* Task Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-center text-primary mb-3">Add New Task</h2>
            {warning && <div className="alert alert-warning mb-3">{warning}</div>}
            <input
              type="text"
              name="title"
              className="form-control mb-2"
              placeholder="Task Title"
              value={newTask.title}
              onChange={handleChange}
              required
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
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <select
                  name="priority"
                  className="form-select"
                  value={newTask.priority}
                  onChange={handleChange}
                >
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>
              <div className="col-md-6">
                <select
                  name="status"
                  className="form-select"
                  value={newTask.status}
                  onChange={handleChange}
                >
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">⚒️ In Progress</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-success px-3"
                onClick={handleAddTask}
                disabled={isSubmitting}
              >
                {isSubmitting ? <FaSpinner className="fa-spin me-2" /> : '✅ Save Task'}
              </button>
              <button 
                className="btn btn-secondary px-3"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;