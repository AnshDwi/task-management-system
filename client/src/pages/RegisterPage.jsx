import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { user, register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <AuthForm
        title="Create account"
        subtitle="Start managing your tasks with a simple full-stack app."
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        buttonText="Register"
        isRegister
        error={error}
      />
    </div>
  );
}

export default RegisterPage;
