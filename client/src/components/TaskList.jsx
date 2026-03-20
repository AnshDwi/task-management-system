import { motion } from "framer-motion";

function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>🚀 No tasks yet</h3>
        <p>Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const isOverdue =
          task.dueDate &&
          new Date(task.dueDate) < new Date() &&
          task.status !== "completed";

        return (
          <motion.div
            key={task._id}
            className={`task-card ${isOverdue ? "overdue" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
          >
            {/* TOP */}
            <div className="task-card-top">
              <div>
                <h3>{task.title}</h3>

                {/* STATUS */}
                <span className={`status-badge ${task.status}`}>
                  {task.status}
                </span>

                {/* PRIORITY */}
                <span
                  className={`priority-badge ${task.priority?.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </div>

              {/* CHECKBOX */}
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => onToggleStatus(task)}
                />
                Done
              </label>
            </div>

            {/* DESCRIPTION */}
            <p>{task.description || "No description added."}</p>

            {/* 📅 DUE DATE */}
            <p className="due-date">
              📅{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No deadline"}
            </p>

            {/* ACTIONS */}
            <div className="task-actions">
              <button
                className="secondary-button"
                onClick={() => onEdit(task)}
              >
                ✏️ Edit
              </button>

              <button
                className="danger-button"
                onClick={() => onDelete(task._id)}
              >
                🗑 Delete
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default TaskList;