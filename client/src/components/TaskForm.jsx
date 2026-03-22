function TaskForm({
  formData,
  onChange,
  onSubmit,
  isEditing,
  onCancelEdit,
}) {
  return (
    <div className="task-form-card">
      <div className="section-heading">
        <p className="eyebrow">Editor</p>
        <h2>{isEditing ? "Update task" : "Create a new task"}</h2>
      </div>

      <form className="task-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={onChange}
            placeholder="Ship onboarding flow"
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
            placeholder="Add a concise summary, notes, or next steps"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={formData.priority} onChange={onChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={onChange}>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={onChange}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={onChange}
          />
        </div>

        <div className="button-row">
          <button type="submit" className="primary-button">
            {isEditing ? "Save changes" : "Add task"}
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
