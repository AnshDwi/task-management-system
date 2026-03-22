const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/reorder", reorderTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
