import { motion } from "framer-motion";

function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks yet</h3>
        <p>Create your first task to start building momentum.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <motion.div
          key={task._id}
          className={`task-card ${task.status === "completed" ? "task-completed" : ""}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="task-card-top">
            <div>
              <h3>{task.title}</h3>
              <div className="badge-row">
                <span className={`status-badge ${task.status}`}>{task.status}</span>
                <span className={`priority-badge ${task.priority?.toLowerCase() || "medium"}`}>
                  {task.priority || "Medium"}
                </span>
                {task.dueDate && (
                  <span className="date-badge">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
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
        </motion.div>
      ))}
    </div>
  );
}

export default TaskList;
