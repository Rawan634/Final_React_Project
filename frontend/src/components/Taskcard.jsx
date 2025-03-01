const TaskCard = ({ task }) => {
  return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="card-body">
        <h5 className="card-title fw-bold">{task.title}</h5>
        <p className="card-text">{task.description}</p>
        <p className="text-muted">Status: {task.status}</p>
        <p className="text-muted">Priority: {task.priority}</p>

        {/* Edit & Delete Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-warning px-3">✏️ Edit</button>
          <button className="btn btn-danger px-3">🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
