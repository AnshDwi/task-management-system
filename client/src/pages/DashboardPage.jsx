import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";

const initialFormState = {
  title: "",
  description: "",
  status: "pending",
};

function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    try {
      if (editingTaskId) {
        const { data } = await axiosInstance.put(`/tasks/${editingTaskId}`, formData);
        setTasks((previous) =>
          previous.map((task) => (task._id === editingTaskId ? data : task))
        );
      } else {
        const { data } = await axiosInstance.post("/tasks", formData);
        setTasks((previous) => [data, ...previous]);
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
    });
  };

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks((previous) => previous.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const { data } = await axiosInstance.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        status: nextStatus,
      });
      setTasks((previous) =>
        previous.map((currentTask) => (currentTask._id === task._id ? data : currentTask))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task status");
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Task Manager</p>
          <h1>{user?.name}'s Dashboard</h1>
          <p className="header-subtitle">Track work, stay focused, and finish what matters.</p>
        </div>
        <button className="secondary-button" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <div>
          <TaskForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEditing={Boolean(editingTaskId)}
            onCancelEdit={resetForm}
          />
          {error && <p className="error-message dashboard-error">{error}</p>}
        </div>

        <div className="task-panel">
          <div className="task-panel-header">
            <h2>Your Tasks</h2>
            <button className="secondary-button" onClick={fetchTasks}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading tasks...</h3>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
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
