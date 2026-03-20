import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

function TaskList({ tasks, onEdit, onDelete, onToggleStatus, setTasks }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>🚀 No tasks yet</h3>
        <p>Create your first task to get started.</p>
      </div>
    );
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setTasks(items); // update UI
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task._id}
                draggableId={task._id}
                index={index}
              >
                {(provided) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="task-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
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
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskList;