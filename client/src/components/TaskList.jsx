function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks yet</h3>
        <p>Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          <div className="task-card-top">
            <div>
              <h3>{task.title}</h3>
              <span className={`status-badge ${task.status}`}>{task.status}</span>
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() => onToggleStatus(task)}
              />
              Mark done
            </label>
          </div>

          <p>{task.description || "No description added."}</p>

          <div className="task-actions">
            <button className="secondary-button" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="danger-button" onClick={() => onDelete(task._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
