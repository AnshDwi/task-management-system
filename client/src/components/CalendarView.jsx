function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getCalendarDays(currentDate) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = [];

  const prefix = start.getDay();
  for (let i = 0; i < prefix; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= end.getDate(); day += 1) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  return days;
}

function CalendarView({ tasks }) {
  const currentDate = new Date();
  const days = getCalendarDays(currentDate);

  const tasksByDate = tasks.reduce((accumulator, task) => {
    if (!task.dueDate) {
      return accumulator;
    }

    const key = new Date(task.dueDate).toDateString();
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(task);
    return accumulator;
  }, {});

  return (
    <section className="task-panel calendar-panel">
      <div className="task-panel-header">
        <div>
          <p className="eyebrow">Calendar View</p>
          <h2>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
        </div>
      </div>

      <div className="calendar-grid calendar-head">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-head-cell">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="calendar-cell muted" />;
          }

          const items = tasksByDate[date.toDateString()] || [];
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={date.toISOString()} className={`calendar-cell ${isToday ? "today" : ""}`}>
              <div className="calendar-date">{date.getDate()}</div>
              <div className="calendar-items">
                {items.slice(0, 3).map((task) => (
                  <div key={task._id} className={`calendar-task ${task.priority?.toLowerCase()}`}>
                    {task.title}
                  </div>
                ))}
                {items.length > 3 && <span className="calendar-more">+{items.length - 3} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarView;
