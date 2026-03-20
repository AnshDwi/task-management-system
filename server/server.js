const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ FIXED CORS (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-management-system-gamma.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Test route
app.get("/api", (req, res) => {
  res.json({ message: "Task Management API is running" });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});