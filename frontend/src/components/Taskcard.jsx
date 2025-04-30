import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  FaEdit, 
  FaTrash, 
  FaRegClock, 
  FaFlag, 
  FaClipboardList, 
  FaInfoCircle,
  FaSpinner,
  FaCheck
} from "react-icons/fa";
import { deleteTaskFromDB, updateTaskInDB } from "../store/taskSlice";

const TaskCard = ({ task, onDragStart }) => {  // Add onDragStart to props
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
    if (onDragStart) {
      onDragStart(task);
    }
  };

  const handleEditChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateTaskInDB({ 
        taskId: task._id, 
        updatedTask: editedTask 
      })).unwrap();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSaving(false);
      setIsEditing(false); 
    }
  };
  

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
  
    setIsDeleting(true);
    try {
      await dispatch(deleteTaskFromDB(task._id)).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = () => {
    switch(task.priority) {
      case "High": return "danger";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "secondary";
    }
  };

  const getStatusColor = () => {
    switch(task.status) {
      case "Pending": return "secondary";
      case "In Progress": return "info";
      case "Completed": return "success";
      default: return "light";
    }
  };

  return (
    <div 
      className="card mb-3 shadow-sm border-0 draggable"
      draggable
      onDragStart={handleDragStart}  // Use the local handler
    >
      <div className="card-body p-3">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              name="title"
              className="form-control mb-2"
              value={editedTask.title}
              onChange={handleEditChange}
              required
            />
            <textarea
              name="description"
              className="form-control mb-2"
              value={editedTask.description}
              onChange={handleEditChange}
              rows="3"
            />
            <div className="d-flex gap-2 mb-2">
              <input
                type="date"
                name="dueDate"
                className="form-control"
                value={editedTask.dueDate}
                onChange={handleEditChange}
              />
              <select
                name="priority"
                className="form-select"
                value={editedTask.priority}
                onChange={handleEditChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                name="status"
                className="form-select"
                value={editedTask.status}
                onChange={handleEditChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-sm btn-success d-flex align-items-center" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <FaSpinner className="fa-spin" />
                ) : (
                  <>
                    <FaCheck className="me-1" /> Save
                  </>
                )}
              </button>
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="card-title mb-0 fw-bold text-truncate">
                <FaClipboardList className={`me-2 text-${getStatusColor()}`} /> 
                {task.title}
              </h6>
              <span className={`badge bg-${getPriorityColor()} text-white`}>
                {task.priority}
              </span>
            </div>
            
            <p className="card-text small mb-2 text-muted">
              {task.description || "No description"}
            </p>
            
            <div className="d-flex justify-content-between align-items-center small">
              <span className="text-muted">
                <FaRegClock className="me-1" /> 
                {task.dueDate || "No due date"}
              </span>
              <div className="d-flex gap-1">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <FaSpinner className="fa-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;