"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import {
  FaEdit,
  FaTrash,
  FaRegClock,
  FaClipboardList,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaStar,
  FaRegStar,
} from "react-icons/fa"
import { deleteTaskFromDB, updateTaskInDB, addTaskToFavorites, removeTaskFromFavorites } from "../store/taskSlice"

const TaskCard = ({ task, onDragStart, onUpdate }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState({ ...task })
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  const handleDragStart = (e) => {
    if (!task?._id || !isValidId(task._id)) {
      e.preventDefault()
      return
    }

    e.dataTransfer.setData("text/plain", task._id)
    if (onDragStart) onDragStart(task)
  }

  const handleEditChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value })
  }

  const isValidId = (id) => {
    return (
      id &&
      (typeof id === "string" || typeof id === "number") &&
      (/^[0-9a-f]{24}$/.test(id) || /^temp-[0-9a-f]{24}$/.test(id) || /^\d+$/.test(id))
    )
  }

  const handleSave = async () => {
    if (!isValidId(task._id)) {
      alert("Task is not ready for editing yet")
      return
    }

    setIsSaving(true)

    try {
      await dispatch(
        updateTaskInDB({
          taskId: task._id,
          updatedTask: editedTask,
          originalTask: task,
        }),
      ).unwrap()

      setIsEditing(false)
    } catch (error) {
      console.error("Update failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      console.log("Deleting task:", task) 

      dispatch({ type: "tasks/storeDeletedTask", payload: { ...task, isRestored: false } })

      await dispatch(deleteTaskFromDB(task._id)).unwrap()

      console.log("Task deleted successfully") 
      setShowDeleteConfirm(false)
      setShowDeleteSuccess(true)
      setTimeout(() => setShowDeleteSuccess(false), 3000)
    } catch (err) {
      console.error("Delete failed:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true)
    try {
      if (task.favorite) {
        await dispatch(removeTaskFromFavorites(task._id)).unwrap()
      } else {
        await dispatch(addTaskToFavorites(task._id)).unwrap()
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err)
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const getPriorityColor = () => {
    switch (task.priority) {
      case "High":
        return "danger"
      case "Medium":
        return "warning"
      case "Low":
        return "success"
      default:
        return "secondary"
    }
  }

  const getStatusColor = () => {
    switch (task.status) {
      case "Pending":
        return "secondary"
      case "In Progress":
        return "info"
      case "Completed":
        return "success"
      default:
        return "light"
    }
  }

  return (
    <>
      {/* Delete Confirmation Popup*/}
      {showDeleteConfirm && (
        <div className="global-delete-confirm">
          <div className="delete-modal-content">
            <h4>Delete Task</h4>
            <p>
              Are you sure you want to delete "<strong>{task.title}</strong>"?
            </p>
            <div className="delete-modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? <FaSpinner className="fa-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="global-delete-success">
          <FaCheckCircle className="success-icon" />
          Task deleted successfully! You can undo this action.
        </div>
      )}

      {/* Task Card */}
      <div
        className={`task-card ${isHovered ? "hovered" : ""}`}
        data-status={task.status}
        draggable
        onDragStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-body">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                name="title"
                className="form-control mb-2"
                value={editedTask.title}
                onChange={handleEditChange}
                required
                autoFocus
              />
              <div className="description-container">
                <textarea
                  name="description"
                  className="form-control"
                  value={editedTask.description}
                  onChange={handleEditChange}
                  rows="3"
                  placeholder="Add a detailed description..."
                />
              </div>
              <div className="form-grid">
                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={editedTask.dueDate}
                  onChange={handleEditChange}
                />
                <select name="priority" className="form-select" value={editedTask.priority} onChange={handleEditChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <select name="status" className="form-select" value={editedTask.status} onChange={handleEditChange}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn btn-save" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <FaSpinner className="spin" />
                  ) : (
                    <>
                      <FaCheck className="icon" /> Save
                    </>
                  )}
                </button>
                <button className="btn btn-cancel" onClick={() => setIsEditing(false)}>
                  <FaTimes className="icon" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="card-header">
                <div className="title-wrapper">
                  <FaClipboardList className={`task-icon icon-${getStatusColor()}`} />
                  <h6 className="task-title">{task.title}</h6>
                </div>
                <span className={`priority-badge priority-${getPriorityColor()}`}>{task.priority}</span>
              </div>

              <div className="description-container">
                <p className="task-description">
                  {task.description || <span className="no-description">No description</span>}
                </p>
              </div>

              <div className="card-footer">
                <div className="due-date">
                  <FaRegClock className="icon" />
                  {task.dueDate || "No due date"}
                </div>
                <div className="task-actions">
                  <button
                    className={`btn btn-favorite ${task.favorite ? "active" : ""}`}
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                  >
                    {isTogglingFavorite ? (
                      <FaSpinner className="fa-spin" />
                    ) : task.favorite ? (
                      <FaStar className="favorite-icon" />
                    ) : (
                      <FaRegStar className="favorite-icon" />
                    )}
                  </button>
                  <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default TaskCard
