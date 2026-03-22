import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { AlertTriangle, CalendarClock, FolderOpen } from "lucide-react";

const columns = [
  { id: "pending", title: "Pending", tone: "pending" },
  { id: "completed", title: "Completed", tone: "completed" },
];

function getDueState(task) {
  if (!task.dueDate || task.status === "completed") {
    return "none";
  }

  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dueKey = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();

  if (dueKey < todayKey) {
    return "overdue";
  }

  if (dueKey === todayKey) {
    return "today";
  }

  return "upcoming";
}

function TaskBoard({ groupedTasks, onDragEnd, onEdit, onDelete, onToggleStatus, dragLocked }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-grid">
        {columns.map((column) => (
          <Droppable droppableId={column.id} key={column.id} isDropDisabled={dragLocked}>
            {(provided, snapshot) => (
              <div
                className={`board-column ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="column-header">
                  <div>
                    <h3>{column.title}</h3>
                    <p>{groupedTasks[column.id].length} tasks</p>
                  </div>
                  <span className={`column-pill ${column.tone}`}>{column.title}</span>
                </div>

                <div className="column-body">
                  {groupedTasks[column.id].map((task, index) => {
                    const dueState = getDueState(task);

                    return (
                      <Draggable
                        draggableId={task._id}
                        index={index}
                        key={task._id}
                        isDragDisabled={dragLocked}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`task-card board-task ${dragSnapshot.isDragging ? "dragging" : ""} due-${dueState}`}
                          >
                            <div className="task-card-top">
                              <div>
                                <h3>{task.title}</h3>
                                <div className="badge-row">
                                  <span className={`status-badge ${task.status}`}>{task.status}</span>
                                  <span
                                    className={`priority-badge ${task.priority?.toLowerCase() || "medium"}`}
                                  >
                                    {task.priority || "Medium"}
                                  </span>
                                  <span className="category-badge">
                                    <FolderOpen size={12} />
                                    {task.category || "Work"}
                                  </span>
                                </div>
                              </div>
                              <label className="checkbox-row">
                                <input
                                  type="checkbox"
                                  checked={task.status === "completed"}
                                  onChange={() => onToggleStatus(task)}
                                />
                                Done
                              </label>
                            </div>

                            <p>{task.description || "No description added."}</p>

                            <div className="task-meta">
                              <span className={`due-pill ${dueState}`}>
                                {dueState === "overdue" && <AlertTriangle size={14} />}
                                {dueState === "today" && <CalendarClock size={14} />}
                                {task.dueDate
                                  ? `Due ${new Date(task.dueDate).toLocaleDateString()}`
                                  : "No deadline"}
                              </span>
                            </div>

                            <div className="task-actions">
                              <button className="secondary-button" onClick={() => onEdit(task)}>
                                Edit
                              </button>
                              <button className="danger-button" onClick={() => onDelete(task._id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskBoard;
