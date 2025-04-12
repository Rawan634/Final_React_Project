import { useState } from "react";
import { 
  FaEdit, 
  FaTrash, 
  FaRegClock, 
  FaFlag, 
  FaClipboardList, 
  FaInfoCircle,
  FaSpinner
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteTaskFromDB, updateTaskInDB } from "../store/taskSlice";

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
  
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const result = await dispatch(deleteTaskFromDB(task._id)).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleteError(
        err.payload?.msg || 
        err.message || 
        "Failed to delete task. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card shadow-sm p-3 mb-3 task-card border-0" 
      style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
      
      <div className="card-body">
        {deleteError && (
          <div className="alert alert-danger mb-3 d-flex justify-content-between align-items-center">
            <span>{deleteError}</span>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setDeleteError(null)}
              aria-label="Close"
            />
          </div>
        )}

        {isEditing ? (
          <>
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
            <input
              type="date"
              name="dueDate"
              className="form-control mb-2"
              value={editedTask.dueDate}
              onChange={handleEditChange}
            />
            <select
              name="priority"
              className="form-select mb-2"
              value={editedTask.priority}
              onChange={handleEditChange}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
            <select
              name="status"
              className="form-select mb-2"
              value={editedTask.status}
              onChange={handleEditChange}
            >
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">⚒️ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
            <div className="d-flex justify-content-end gap-2 mt-2">
              <button 
                className="btn btn-success d-flex align-items-center" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="me-2 fa-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    💾 Save
                  </>
                )}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                ❌ Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h5 className="fw-semibold d-flex align-items-center">
              <FaClipboardList className="me-2 text-primary" /> {editedTask.title}
            </h5>
            <p className="text-muted mb-2">
              <FaRegClock className="me-2 text-secondary" /> 
              <strong>Due:</strong> {editedTask.dueDate || "No due date"}
            </p>
            
            <div style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '0.5rem' }}>
              <p className="card-text">{editedTask.description}</p>
            </div>

            <p className="text-muted mb-2">
              <FaFlag className="me-2 text-danger" /> 
              <strong>Priority:</strong> {editedTask.priority}
            </p>
            <p className="text-muted">
              <FaInfoCircle className="me-2 text-info" /> 
              <strong>Status:</strong> {editedTask.status}
            </p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button 
                className="btn btn-outline-primary d-flex align-items-center" 
                onClick={() => setIsEditing(true)}
              >
                <FaEdit className="me-2" /> Edit
              </button>
              <button 
                className="btn btn-outline-danger d-flex align-items-center" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <FaSpinner className="me-2 fa-spin" />
                ) : (
                  <FaTrash className="me-2" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;