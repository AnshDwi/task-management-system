const Task = require("../models/Task");
const { emitTaskEvent } = require("../config/socket");

// 🟢 GET TASKS
const getTasks = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { search = "", status, category, sortBy = "newest" } = req.query;

    const query = { user: req.user._id };

    if (status && status !== "all") query.status = status;
    if (category && category !== "all") query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      priority: { priority: 1, createdAt: -1 },
      dueDate: { dueDate: 1, createdAt: -1 },
      status: { status: 1, order: 1, createdAt: -1 },
    };

    const tasks = await Task.find(query).sort(
      sortOptions[sortBy] || sortOptions.newest
    );

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// 🟢 CREATE TASK
const createTask = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, status, priority, dueDate, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const taskCount = await Task.countDocuments({
      user: req.user._id,
      status: status || "pending",
    });

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      priority: priority || "Medium",
      category: category || "Work",
      dueDate: dueDate || null,
      order: taskCount,
      user: req.user._id,
    });

    emitTaskEvent?.(req.user._id.toString(), "task:created", {
      message: `Task "${task.title}" created`,
      task,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// 🟢 UPDATE TASK
const updateTask = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, status, priority, dueDate, order, category } =
      req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.category = category ?? task.category;
    task.dueDate = dueDate ?? task.dueDate;
    task.order = order ?? task.order;

    const updated = await task.save();

    emitTaskEvent?.(req.user._id.toString(), "task:updated", {
      message: `Task "${updated.title}" updated`,
      task: updated,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// 🟢 DELETE TASK
const deleteTask = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const deletedTitle = task.title;

    await task.deleteOne();

    emitTaskEvent?.(req.user._id.toString(), "task:deleted", {
      message: `Task "${deletedTitle}" deleted`,
      taskId: req.params.id,
    });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// 🟢 REORDER TASKS
const reorderTasks = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res
        .status(400)
        .json({ message: "Task reorder payload is required" });
    }

    const taskIds = updates.map((item) => item.id);

    const ownedTasks = await Task.find({
      _id: { $in: taskIds },
      user: req.user._id,
    }).select("_id");

    if (ownedTasks.length !== taskIds.length) {
      return res
        .status(403)
        .json({ message: "Invalid task ownership" });
    }

    await Promise.all(
      updates.map((item) =>
        Task.updateOne(
          { _id: item.id, user: req.user._id },
          {
            $set: {
              status: item.status,
              order: item.order,
            },
          }
        )
      )
    );

    const tasks = await Task.find({ user: req.user._id }).sort({
      status: 1,
      order: 1,
      createdAt: -1,
    });

    emitTaskEvent?.(req.user._id.toString(), "task:reordered", {
      message: "Tasks reordered",
      tasks,
    });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
};