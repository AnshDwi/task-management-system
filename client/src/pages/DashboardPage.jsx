import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";

const initialFormState = {
  title: "",
  description: "",
  status: "pending",
  priority: "Medium",
  dueDate: "", // ✅ important
};

function DashboardPage() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterPriority, setFilterPriority] = useState("All");
  const [search, setSearch] = useState("");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "system"
  );

  // 📊 STATS
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  // 🌗 THEME
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (theme === "light") {
      root.removeAttribute("data-theme");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingTaskId(null);
  };
console.log("FORM DATA:", formData);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || null,
      };

      if (editingTaskId) {
        const { data } = await axiosInstance.put(
          `/tasks/${editingTaskId}`,
          payload
        );

        setTasks((prev) =>
          prev.map((task) =>
            task._id === editingTaskId ? data : task
          )
        );
      } else {
        const { data } = await axiosInstance.post(
          "/tasks",
          payload
        );

        setTasks((prev) => [data, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority || "Medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  };

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks((prev) =>
        prev.filter((task) => task._id !== taskId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus =
      task.status === "completed" ? "pending" : "completed";

    try {
      const { data } = await axiosInstance.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        status: nextStatus,
        priority: task.priority,
        dueDate: task.dueDate,
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? data : t))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Task Manager</p>
          <h1>{user?.name}'s Dashboard</h1>
        </div>

        <div className="header-actions">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="theme-select"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{total}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completed}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>
      </div>

      {/* MAIN */}
      <section className="dashboard-grid">
        <div>
          <TaskForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEditing={Boolean(editingTaskId)}
            onCancelEdit={resetForm}
          />

          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="task-panel">
          <div className="task-panel-header">
            <h2>Your Tasks</h2>
            <button className="secondary-button" onClick={fetchTasks}>
              Refresh
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          {/* FILTER */}
          <div className="form-group">
            <label>Filter by Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading tasks...</h3>
            </div>
          ) : (
            <TaskList
              tasks={tasks
                .filter((task) =>
                  filterPriority === "All"
                    ? true
                    : task.priority === filterPriority
                )
                .filter((task) =>
                  task.title.toLowerCase().includes(search.toLowerCase())
                )}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;