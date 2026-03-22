import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(formData);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-panel">
          <p className="eyebrow">Production-like Starter</p>
          <h2>Keep work visible, measurable, and under control.</h2>
          <p>
            TaskFlow gives you secure auth, a protected dashboard, and a clean task
            workspace with status, priority, and deadline tracking.
          </p>
        </div>
        <AuthForm
          title="Welcome back"
          subtitle="Sign in to continue managing your tasks."
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          buttonText="Login"
          error={error}
        />
      </div>
    </div>
  );
}

export default LoginPage;
