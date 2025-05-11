import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import AppLogo from "../assets/Taskly.png"
import {
  FaPlus,
  FaTrash,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaArrowDown,
  FaSpinner,
  FaStar,
  FaUndo,
} from "react-icons/fa"
import { addTaskToDB, clearTasksFromDB, restoreDeletedTask } from "../store/taskSlice"

const Sidebar = ({ priority, setPriority, showFavorites, setShowFavorites }) => {
  const dispatch = useDispatch()
  const deletedTasks = useSelector((state) => state.tasks.deletedTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showUndoMessage, setShowUndoMessage] = useState(false)
  const [showRestoreSuccess, setShowRestoreSuccess] = useState(false)
  const [restoredTaskName, setRestoredTaskName] = useState("")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  })
  const [warning, setWarning] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const togglePriority = (newPriority) => {
    setPriority(newPriority === priority ? "" : newPriority)
    if (newPriority !== priority) {
      setShowFavorites(false)
    }
  }

  const toggleFavorites = () => {
    if (!showFavorites) {
      setPriority("")
    }
    setShowFavorites(!showFavorites)
  }

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value })
    setWarning("")
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setWarning("Title is required!")
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(addTaskToDB(newTask)).unwrap()

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
      })
      setIsModalOpen(false)
    } catch (err) {
      setWarning(err.message || "Failed to add task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAll = async () => {
    setIsDeleting(true)
    try {
      await dispatch(clearTasksFromDB()).unwrap()
      setIsDeleteModalOpen(false)
    } catch (err) {
      setWarning(err.message || "Failed to delete tasks")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUndoDelete = () => {
    if (deletedTasks.length === 0) {
      setShowUndoMessage(true)
      setTimeout(() => setShowUndoMessage(false), 3000)
      return
    }

    //the undo action
    const taskToRestore = deletedTasks[0] 
    setRestoredTaskName(taskToRestore.title || "Task")

    if (taskToRestore) {
      dispatch(restoreDeletedTask(taskToRestore))
    }

    setShowRestoreSuccess(true)
    setTimeout(() => setShowRestoreSuccess(false), 3000)

    console.log("Undo action dispatched, task to restore:", taskToRestore)
  }

  return (
    <div className="p-3 vh-100 d-flex flex-column">
      {/* Logo Section */}
      <div className="text-center mb-4">
        <div className="sidebar-logo">
          <img src={AppLogo || "/placeholder.svg"} alt="App Logo" />
        </div>
      </div>

      {/* Priority Section */}
      <div className="mb-4">
        <h5 className="text-center mb-4 fs-5 fw-bold">Priority Levels</h5>
        <div className="d-flex flex-column gap-2">
          <button
            className={`btn btn-outline-danger fs-6 d-flex align-items-center gap-2 mb-2 ${priority === "High" ? "bg-danger" : ""}`}
            onClick={() => togglePriority("High")}
          >
            <FaExclamationTriangle /> <span className="text-white">High</span>
          </button>
          <button
            className={`btn btn-outline-warning fs-6 d-flex align-items-center gap-2 mb-2 ${priority === "Medium" ? "bg-warning" : ""}`}
            onClick={() => togglePriority("Medium")}
          >
            <FaExclamationCircle /> <span className="text-white">Medium</span>
          </button>
          <button
            className={`btn btn-outline-success fs-6 d-flex align-items-center gap-2 mb-2 ${priority === "Low" ? "bg-success" : ""}`}
            onClick={() => togglePriority("Low")}
          >
            <FaArrowDown /> <span className="text-white">Low</span>
          </button>
        </div>
      </div>

      {/* Favorites Filter Section */}
      <div className="mb-auto">
        <h5 className="text-center mb-4 fs-5 fw-bold">Extra Filter</h5>
        <button
          className={`btn btn-outline-warning fs-6 d-flex w-100 align-items-center gap-2 mb-4 ${showFavorites ? "bg-warning" : ""}`}
          onClick={toggleFavorites}
        >
          <FaStar /> <span className="text-white">Favorites</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto d-flex flex-column gap-2">
        <button
          style={{ fontSize: "15px" }}
          className="btn btn-add-task d-flex align-items-center gap-2 justify-content-center"
          onClick={() => setIsModalOpen(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <FaSpinner className="fa-spin" />
          ) : (
            <>
              <FaPlus /> Add Task
            </>
          )}
        </button>

        {/* Undo Button */}
        <button
          style={{ fontSize: "15px" }}
          className="btn btn-undo d-flex align-items-center gap-2 justify-content-center"
          onClick={handleUndoDelete}
        >
          <FaUndo /> Undo Delete {deletedTasks.length > 0 && `(${deletedTasks.length})`}
        </button>

        {/* Delete All Button */}
        <button
          style={{ fontSize: "15px" }}
          className="btn btn-delete-all d-flex align-items-center gap-2 justify-content-center"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <FaSpinner className="fa-spin" />
          ) : (
            <>
              <FaTrash /> Delete All
            </>
          )}
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
                <select name="priority" className="form-select" value={newTask.priority} onChange={handleChange}>
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>
              <div className="col-md-6">
                <select name="status" className="form-select" value={newTask.status} onChange={handleChange}>
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">⚒️ In Progress</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-success px-3" onClick={handleAddTask} disabled={isSubmitting}>
                {isSubmitting ? <FaSpinner className="fa-spin me-2" /> : "✅ Save Task"}
              </button>
              <button className="btn btn-secondary px-3" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
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
              <p>Are you sure you want to delete ALL tasks? This action can be undone only if the page is not refreshed.</p>
              <div className="delete-confirm-actions">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteAll} disabled={isDeleting}>
                  {isDeleting ? <FaSpinner className="fa-spin me-2" /> : <FaTrash className="me-2" />}
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUndoMessage && (
        <div className="toast-notification warning">
          <p>No deleted tasks to restore</p>
        </div>
      )}

      {showRestoreSuccess && (
        <div className="toast-notification success">
          <p>"{restoredTaskName}" has been restored!</p>
        </div>
      )}

    </div>
  )
}

export default Sidebar
