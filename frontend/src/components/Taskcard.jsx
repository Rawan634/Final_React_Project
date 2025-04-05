import { useState } from "react";
import { FaEdit, FaTrash, FaRegClock, FaFlag, FaClipboardList, FaInfoCircle } from "react-icons/fa";

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleEditChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  return (
    <div className="card shadow-sm p-3 mb-3 task-card border-0" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
      <div className="card-body">
        {isEditing ? (
          <>
            <input type="text" name="title" className="form-control mb-2" value={editedTask.title} onChange={handleEditChange} />
            <textarea name="description" className="form-control mb-2" value={editedTask.description} onChange={handleEditChange} />
            <input type="date" name="dueDate" className="form-control mb-2" value={editedTask.dueDate} onChange={handleEditChange} />
            <select name="priority" className="form-select mb-2" value={editedTask.priority} onChange={handleEditChange}>
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
            <select name="status" className="form-select mb-2" value={editedTask.status} onChange={handleEditChange}>
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">⚒️ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
            <div className="d-flex justify-content-end gap-2 mt-2">
              <button className="btn btn-success" onClick={() => { onUpdate(editedTask); setIsEditing(false); }}>💾 Save</button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>❌ Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h5 className="fw-semibold d-flex align-items-center">
              <FaClipboardList className="me-2 text-primary" /> {task.title}
            </h5>
            <p className="text-muted mb-2">
              <FaRegClock className="me-2 text-secondary" /> <strong>Due:</strong> {task.dueDate || "No due date"}
            </p>
            
            {/* Scrollable description */}
            <div style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '0.5rem' }}>
              <p className="card-text">{task.description}</p>
            </div>

            <p className="text-muted mb-2">
              <FaFlag className="me-2 text-danger" /> <strong>Priority:</strong> {task.priority}
            </p>
            <p className="text-muted">
              <FaInfoCircle className="me-2 text-info" /> <strong>Status:</strong> {task.status}
            </p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-primary d-flex align-items-center" onClick={() => setIsEditing(true)}>
                <FaEdit className="me-2" /> Edit
              </button>
              <button className="btn btn-outline-danger d-flex align-items-center" onClick={onDelete}>
                <FaTrash className="me-2" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
