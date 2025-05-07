import { useState } from 'react';
import { useDispatch } from 'react-redux';
import AppLogo from "../assets/Logo.jpeg"
import { 
  FaPlus, 
  FaTrash, 
  FaExclamationTriangle, 
  FaExclamationCircle, 
  FaArrowDown,
  FaSpinner,
  FaTasks,
  FaStar
} from "react-icons/fa";
import { addTaskOptimistically, addTaskToDB, clearTasksFromDB } from "../store/taskSlice";

const Sidebar = ({ priority, setPriority, showFavorites, setShowFavorites }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
    if (newPriority !== priority) {
      setShowFavorites(false);
    }
  };

  const toggleFavorites = () => {
    if (!showFavorites) {
      setPriority('');
    }
    setShowFavorites(!showFavorites);
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
      dispatch(addTaskOptimistically(tempTask));
      await dispatch(addTaskToDB({ ...newTask, tempId })).unwrap();
      
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
      });
      setIsModalOpen(false);
    } catch (err) {
      dispatch(removeTaskTemporarily(tempId));
      setWarning(err.message || "Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await dispatch(clearTasksFromDB()).unwrap();
      setIsDeleteModalOpen(false);
    } catch (err) {
      setWarning(err.message || "Failed to delete tasks");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-3 vh-100 d-flex flex-column">
      {/* Logo Section */}
      <div className="text-center mb-4">
      <div className="sidebar-logo"><img src={AppLogo} alt="App Logo" /></div>
      </div>

      {/* Priority Section */}
      <div className="mb-4">
        <h5 className="text-center mb-4 fs-5 fw-bold">Priority Levels</h5>
        <div className="d-flex flex-column gap-2">
          <button 
            className={`btn btn-outline-danger fs-6 d-flex align-items-center gap-2 mb-2 ${priority === 'High' ? 'bg-danger' : ''}`} 
            onClick={() => togglePriority('High')}
          >
            <FaExclamationTriangle /> <span className="text-white">High</span>
          </button>
          <button 
            className={`btn btn-outline-warning fs-6 d-flex align-items-center gap-2 mb-2 ${priority === 'Medium' ? 'bg-warning' : ''}`} 
            onClick={() => togglePriority('Medium')}
          >
            <FaExclamationCircle /> <span className="text-white">Medium</span>
          </button>
          <button 
            className={`btn btn-outline-success fs-6 d-flex align-items-center gap-2 mb-2 ${priority === 'Low' ? 'bg-success' : ''}`} 
            onClick={() => togglePriority('Low')}
          >
            <FaArrowDown /> <span className="text-white">Low</span>
          </button>
        </div>
      </div>

      {/* Favorites Filter Section */}
      <div className="mb-auto">
        <h5 className="text-center mb-4 fs-5 fw-bold">Extra Filter</h5>
        <button 
          className={`btn btn-outline-warning fs-6 d-flex w-100 align-items-center gap-2 mb-4 ${showFavorites ? 'bg-warning' : ''}`} 
          onClick={toggleFavorites}
        >
          <FaStar /> <span className="text-white">Favorites</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto d-flex flex-column gap-2">
        <button 
          style={{ fontSize: '15px' }}
          className="btn btn-primary d-flex align-items-center gap-2 justify-content-center"
          onClick={() => setIsModalOpen(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <FaSpinner className="fa-spin" /> : <><FaPlus /> Add Task</>}
        </button>
        <button 
          style={{ fontSize: '15px' }}
          className="btn btn-outline-danger d-flex align-items-center gap-2 justify-content-center"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isDeleting}
        >
          {isDeleting ? <FaSpinner className="fa-spin" /> : <><FaTrash /> Delete All</>}
        </button>
      </div>

      {/* Add Task Modal */}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <div className="delete-confirm-content">
              <h4 className="text-danger">Confirm Deletion</h4>
              <p>Are you sure you want to delete ALL tasks? This action cannot be undone.</p>
              <div className="delete-confirm-actions">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteAll}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <FaSpinner className="fa-spin me-2" />
                  ) : (
                    <FaTrash className="me-2" />
                  )}
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;