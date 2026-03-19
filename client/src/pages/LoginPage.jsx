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
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <AuthForm
        title="Welcome back"
        subtitle="Login to manage your tasks and stay organized."
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        buttonText="Login"
        error={error}
      />
    </div>
  );
}

export default LoginPage;
