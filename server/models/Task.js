const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    category: {
      type: String,
      enum: ["Work", "Personal", "Study"],
      default: "Work",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    order: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Safe model export (prevents overwrite bug)
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

module.exports = Task;