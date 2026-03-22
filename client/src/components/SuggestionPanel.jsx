function scoreTask(task) {
  let score = 0;

  if (task.status === "pending") {
    score += 5;
  }

  if (task.priority === "High") {
    score += 4;
  } else if (task.priority === "Medium") {
    score += 2;
  }

  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const diffInDays = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      score += 6;
    } else if (diffInDays === 0) {
      score += 5;
    } else if (diffInDays <= 2) {
      score += 3;
    }
  }

  return score;
}

function SuggestionPanel({ tasks }) {
  const suggestions = tasks
    .filter((task) => task.status === "pending")
    .sort((a, b) => scoreTask(b) - scoreTask(a))
    .slice(0, 5);

  return (
    <section className="task-panel suggestion-panel">
      <div className="task-panel-header">
        <div>
          <p className="eyebrow">AI Focus Mode</p>
          <h2>Suggested tasks for today</h2>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="empty-state compact">
          <h3>No pending tasks</h3>
          <p>Your queue is clear right now.</p>
        </div>
      ) : (
        <div className="suggestion-list">
          {suggestions.map((task, index) => (
            <div key={task._id} className="suggestion-item">
              <span className="suggestion-rank">#{index + 1}</span>
              <div>
                <strong>{task.title}</strong>
                <p>
                  {task.priority} priority
                  {task.dueDate
                    ? ` | Due ${new Date(task.dueDate).toLocaleDateString()}`
                    : " | No deadline"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SuggestionPanel;
