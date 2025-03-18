import { useState } from "react";

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  // Handle input changes for inline editing
  const handleEditChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              className="form-control mb-2"
              value={editedTask.title}
              onChange={handleEditChange}
            />
            <textarea
              name="description"
              className="form-control mb-2"
              value={editedTask.description}
              onChange={handleEditChange}
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
              <button className="btn btn-success" onClick={() => { onUpdate(editedTask); setIsEditing(false); }}>💾 Save</button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>❌ Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h5 className="fw-bold">{task.title}</h5>
            <p className="text-muted"><strong>Due:</strong> {task.dueDate || "No due date"}</p>
            <p className="card-text">{task.description}</p>
            <p className="text-muted"><strong>Status:</strong> {task.status}</p>
            <p className="text-muted"><strong>Priority:</strong> {task.priority}</p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-warning" onClick={() => setIsEditing(true)}>✏️ Edit</button>
              <button className="btn btn-danger" onClick={onDelete}>🗑️ Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
