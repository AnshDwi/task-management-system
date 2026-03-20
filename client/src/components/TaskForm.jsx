function TaskForm({
  formData,
  onChange,
  onSubmit,
  isEditing,
  onCancelEdit,
}) {
  return (
    <div className="task-form-card">
      <h2>{isEditing ? "Edit Task" : "Create New Task"}</h2>

      <form className="task-form" onSubmit={onSubmit}>
        {/* TITLE */}
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={onChange}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
          />
        </div>

        {/* PRIORITY */}
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={onChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* 🔥 IMPORTANT FIX */}
        <div className="form-group">
  <label>Due Date</label>
  <input
    type="date"
    name="dueDate"   // ✅ MUST BE EXACT
    value={formData.dueDate || ""}
    onChange={onChange}
  />
</div>

        {/* STATUS */}
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="button-row">
          <button type="submit" className="primary-button">
            {isEditing ? "Update Task" : "Add Task"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="secondary-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;