const TaskCard = ({ task }) => {
  return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h5 className="card-title fw-bold">{task.title}</h5>
          <p className="text-muted mb-0"><strong>Due:</strong> {task.dueDate}</p>
        </div>
        <p className="card-text">{task.description}</p>
        <p className="text-muted"><strong>Status:</strong> {task.status}</p>
        <p className="text-muted"><strong>Priority:</strong> {task.priority}</p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-warning px-3">✏️ Edit</button>
          <button className="btn btn-danger px-3">🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
