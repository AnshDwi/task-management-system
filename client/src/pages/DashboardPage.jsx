import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownUp, BrainCircuit, RefreshCw } from "lucide-react";
import {
  createTask,
  deleteTask,
  getTasks,
  reorderTasks,
  updateTask,
} from "../api/taskApi";
import { disconnectSocket, getSocket } from "../api/socket";
import AnalyticsPanel from "../components/AnalyticsPanel";
import CalendarView from "../components/CalendarView";
import LoadingSkeleton from "../components/LoadingSkeleton";
import NotificationCenter from "../components/NotificationCenter";
import Sidebar from "../components/Sidebar";
import SuggestionPanel from "../components/SuggestionPanel";
import TaskBoard from "../components/TaskBoard";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../context/AuthContext";

const initialFormState = {
  title: "",
  description: "",
  priority: "Medium",
  category: "Work",
  status: "pending",
  dueDate: "",
};

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("status");
  const [notifications, setNotifications] = useState([]);
  const [activeView, setActiveView] = useState("board");
  const fetchTasksRef = useRef(() => {});
  const lastAlertSignature = useRef("");

  const pushNotification = (title, message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const nextNotification = { id, title, message, type };

    setNotifications((previous) => [nextNotification, ...previous].slice(0, 8));

    window.setTimeout(() => {
      setNotifications((previous) => previous.filter((item) => item.id !== id));
    }, 4500);
  };

  const fetchTasksData = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      setError("");

      const { data } = await getTasks({
        search: searchTerm || undefined,
        status: statusFilter,
        category: categoryFilter,
        sortBy,
      });

      setTasks(data);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch tasks";
      setError(message);
      pushNotification("Sync issue", message, "error");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTasksRef.current = fetchTasksData;
  }, [searchTerm, statusFilter, categoryFilter, sortBy]);

  useEffect(() => {
    fetchTasksData();
  }, [searchTerm, statusFilter, categoryFilter, sortBy]);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return undefined;
    }

    const refreshSilently = () => fetchTasksRef.current({ silent: true });

    socket.on("task:created", refreshSilently);
    socket.on("task:updated", refreshSilently);
    socket.on("task:deleted", refreshSilently);
    socket.on("task:reordered", refreshSilently);

    return () => {
      socket.off("task:created", refreshSilently);
      socket.off("task:updated", refreshSilently);
      socket.off("task:deleted", refreshSilently);
      socket.off("task:reordered", refreshSilently);
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    const overdueCount = tasks.filter(
      (task) => task.dueDate && new Date(task.dueDate) < today && task.status !== "completed"
    ).length;
    const dueTodayCount = tasks.filter(
      (task) => task.dueDate && isSameDay(new Date(task.dueDate), today) && task.status !== "completed"
    ).length;

    const signature = `${overdueCount}-${dueTodayCount}`;
    if (signature === lastAlertSignature.current) {
      return;
    }

    lastAlertSignature.current = signature;

    if (overdueCount > 0) {
      pushNotification("Overdue tasks", `${overdueCount} task(s) are overdue`, "warning");
    }

    if (dueTodayCount > 0) {
      pushNotification("Due today", `${dueTodayCount} task(s) should be finished today`, "info");
    }
  }, [tasks]);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingTaskId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      ...formData,
      dueDate: formData.dueDate || null,
    };

    try {
      if (editingTaskId) {
        const { data } = await updateTask(editingTaskId, payload);
        setTasks((previous) =>
          previous.map((task) => (task._id === editingTaskId ? data : task))
        );
        pushNotification("Task updated", `"${data.title}" saved successfully`, "success");
      } else {
        const { data } = await createTask(payload);
        setTasks((previous) => [data, ...previous]);
        pushNotification("Task created", `"${data.title}" added successfully`, "success");
      }

      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to save task";
      setError(message);
      pushNotification("Save failed", message, "error");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      category: task.category || "Work",
      status: task.status || "pending",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    });
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((previous) => previous.filter((task) => task._id !== id));
      pushNotification("Task deleted", "Task removed successfully", "success");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete task";
      setError(message);
      pushNotification("Delete failed", message, "error");
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const { data } = await updateTask(task._id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        order: task.order,
        status: nextStatus,
      });

      setTasks((previous) =>
        previous.map((currentTask) => (currentTask._id === task._id ? data : currentTask))
      );
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update task status";
      setError(message);
      pushNotification("Update failed", message, "error");
    }
  };

  const groupedTasks = useMemo(() => {
    const grouped = {
      pending: [],
      completed: [],
    };

    tasks.forEach((task) => {
      grouped[task.status]?.push(task);
    });

    grouped.pending.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    grouped.completed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return grouped;
  }, [tasks]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "completed").length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const dueToday = tasks.filter(
      (task) => task.dueDate && isSameDay(new Date(task.dueDate), new Date())
    ).length;
    const overdue = tasks.filter(
      (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
    ).length;

    return [
      { label: "Total Tasks", value: tasks.length },
      { label: "Pending", value: pending },
      { label: "Due Today", value: dueToday },
      { label: "Overdue", value: overdue },
    ];
  }, [tasks]);

  const dragLocked =
    searchTerm.trim().length > 0 ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    sortBy !== "status";

  const handleDragEnd = async (result) => {
    if (dragLocked) {
      pushNotification(
        "Board lock",
        "Clear search, category, status, and custom sorting to reorder tasks safely.",
        "warning"
      );
      return;
    }

    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const nextGrouped = {
      pending: [...groupedTasks.pending],
      completed: [...groupedTasks.completed],
    };

    const sourceColumn = [...nextGrouped[source.droppableId]];
    const [movedTask] = sourceColumn.splice(source.index, 1);

    const destinationColumn =
      source.droppableId === destination.droppableId
        ? sourceColumn
        : [...nextGrouped[destination.droppableId]];

    const updatedTask = {
      ...movedTask,
      status: destination.droppableId,
    };

    destinationColumn.splice(destination.index, 0, updatedTask);

    nextGrouped[source.droppableId] = sourceColumn;
    nextGrouped[destination.droppableId] = destinationColumn;

    const updates = [
      ...nextGrouped.pending.map((task, index) => ({
        ...task,
        status: "pending",
        order: index,
      })),
      ...nextGrouped.completed.map((task, index) => ({
        ...task,
        status: "completed",
        order: index,
      })),
    ];

    setTasks((previous) =>
      previous.map((task) => {
        const updated = updates.find((item) => item._id === task._id);
        return updated ? { ...task, status: updated.status, order: updated.order } : task;
      })
    );

    try {
      const { data } = await reorderTasks(
        updates.map((task) => ({
          id: task._id,
          status: task.status,
          order: task.order,
        }))
      );

      setTasks(data);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to sync the board order";
      setError(message);
      pushNotification("Reorder failed", message, "error");
      fetchTasksData({ silent: true });
    }
  };

  return (
    <div className="dashboard-shell">
      <NotificationCenter
        notifications={notifications}
        onDismiss={(id) =>
          setNotifications((previous) => previous.filter((item) => item.id !== id))
        }
      />

      <Sidebar activeView={activeView} onChangeView={setActiveView} user={user} />

      <div className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Portfolio Killer Build</p>
            <h1>{user?.name || "Your"} Task Command Center</h1>
            <p className="header-subtitle">
              Realtime updates, category-aware filtering, deadline intelligence, analytics,
              and a calendar view in one polished workspace.
            </p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="secondary-button icon-button"
              onClick={() => fetchTasksData()}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              type="button"
              className="secondary-button icon-button"
              onClick={() => setActiveView("suggestions")}
            >
              <BrainCircuit size={16} />
              Suggest today
            </button>
            <button type="button" className="secondary-button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((item) => (
            <div key={item.label} className="stat-card hoverable-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>

        <section className="dashboard-grid enhanced-grid">
          <div className="left-column">
            <TaskForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isEditing={Boolean(editingTaskId)}
              onCancelEdit={resetForm}
            />

            <SuggestionPanel tasks={tasks} />

            {error && <p className="error-message dashboard-error">{error}</p>}
          </div>

          <div className="content-stack">
            <div className="task-panel board-panel">
              <div className="task-panel-header">
                <div>
                  <p className="eyebrow">Smart Controls</p>
                  <h2>Search, sort, and manage</h2>
                </div>
                <div className="inline-note">
                  <ArrowDownUp size={14} />
                  Drag works best in board mode with default sorting
                </div>
              </div>

              <div className="toolbar toolbar-rich">
                <input
                  type="text"
                  placeholder="Search title, description, or category"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="all">All categories</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>

                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="status">Board order</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due date</option>
                </select>
              </div>

              {loading ? (
                <LoadingSkeleton />
              ) : activeView === "calendar" ? (
                <CalendarView tasks={tasks} />
              ) : activeView === "analytics" ? (
                <AnalyticsPanel tasks={tasks} />
              ) : activeView === "suggestions" ? (
                <SuggestionPanel tasks={tasks} />
              ) : (
                <TaskBoard
                  groupedTasks={groupedTasks}
                  onDragEnd={handleDragEnd}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleStatus}
                  dragLocked={dragLocked}
                />
              )}
            </div>

            {activeView !== "analytics" && <AnalyticsPanel tasks={tasks} />}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
