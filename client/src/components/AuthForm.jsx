import { Link } from "react-router-dom";

function AuthForm({
  title,
  subtitle,
  formData,
  onChange,
  onSubmit,
  buttonText,
  isRegister = false,
  error,
}) {
  return (
    <div className="auth-card">
      <h1>{title}</h1>
      <p>{subtitle}</p>

      <form className="auth-form" onSubmit={onSubmit}>
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="primary-button">
          {buttonText}
        </button>
      </form>

      <p className="auth-footer">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link to={isRegister ? "/login" : "/register"}>
          {isRegister ? "Login here" : "Register here"}
        </Link>
      </p>
    </div>
  );
}

export default AuthForm;
