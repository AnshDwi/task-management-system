import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div
      className="auth-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="auth-card-copy">
        <p className="eyebrow">TaskFlow</p>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
      </div>

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

        <button type="submit" className="primary-button auth-submit">
          {buttonText}
        </button>
      </form>

      <p className="auth-footer">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link to={isRegister ? "/login" : "/register"}>
          {isRegister ? "Login here" : "Register here"}
        </Link>
      </p>
    </motion.div>
  );
}

export default AuthForm;
