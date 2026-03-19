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
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={onChange}
            placeholder="Task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={onChange}
            placeholder="Write task details"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={onChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="button-row">
          <button type="submit" className="primary-button">
            {isEditing ? "Update Task" : "Add Task"}
          </button>
          {isEditing && (
            <button type="button" className="secondary-button" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
