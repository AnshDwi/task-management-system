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
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-panel">
          <p className="eyebrow">Secure Onboarding</p>
          <h2>Create your workspace and start shipping tasks with confidence.</h2>
          <p>
            Register once, receive a JWT-backed session, and manage all of your work
            from one protected dashboard.
          </p>
        </div>
        <AuthForm
          title="Create account"
          subtitle="Get started with a production-like MERN workflow."
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          buttonText="Register"
          isRegister
          error={error}
        />
      </div>
    </div>
  );
}

export default RegisterPage;
