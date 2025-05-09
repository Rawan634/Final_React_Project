const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose'); // Add this line

// Middleware to verify token and get user ID
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; 
    next();  
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// ➕ Add Task
router.post("/add", authMiddleware, async (req, res) => {
  console.log('Backend received task:', {
    receivedId: req.body._id,
    body: req.body
  });
  const { title, description, dueDate, priority, status } = req.body;

  try {
    const user = await User.findById(req.userId);
    user.tasks.push({ _id: new mongoose.Types.ObjectId(), title, description, dueDate, priority, status });
    await user.save();
    const newTask = user.tasks[user.tasks.length - 1];
    res.status(201).json(newTask);
    } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 📥 Get All Tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✏️ Update Task
// Update Task
router.put("/:taskId", authMiddleware, async (req, res) => {
  const { taskId } = req.params;
  
  // Accept either MongoDB format or our temporary format
  if (!/^([0-9a-f]{24}|temp-[0-9a-f]{24})$/.test(taskId)) {
    return res.status(400).json({ 
      msg: "Invalid ID format",
      exampleValidId: new mongoose.Types.ObjectId() 
    });
  }

  try {
    const user = await User.findById(req.userId);
    const taskIndex = user.tasks.findIndex(t => 
      t._id.toString() === taskId || t._id === taskId
    );

    if (taskIndex === -1) return res.status(404).json({ msg: "Task not found" });

    // Update only allowed fields
    const allowedUpdates = ['title', 'description', 'dueDate', 'priority', 'status'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user.tasks[taskIndex][field] = req.body[field];
      }
    });

    await user.save();
    res.json(user.tasks[taskIndex]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ❌ Delete Task
router.delete("/:taskId", authMiddleware, async (req, res) => {
    const { taskId } = req.params;
  
    try {
      const user = await User.findById(req.userId);
      
      const taskIndex = user.tasks.findIndex(task => task._id.toString() === taskId);
      
      if (taskIndex === -1) {
        return res.status(404).json({ msg: "Task not found" });
      }
  
      user.tasks.splice(taskIndex, 1);
      
      await user.save();
      res.json({ success: true, deletedTaskId: taskId });
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ 
        msg: "Failed to delete task",
        error: err.message 
      });
    }
  });
  
// ➖ Delete All Tasks
router.delete("/", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      user.tasks = []; 
      await user.save();
      res.json(user.tasks);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

// ⭐ Add Task to Favorites
router.put("/:taskId/favorite", authMiddleware, async (req, res) => {
  const { taskId } = req.params;

  try {
    const user = await User.findById(req.userId);
    const task = user.tasks.id(taskId);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    task.favorite = true;

    await user.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 🔄 Remove Task from Favorites
router.put("/:taskId/unfavorite", authMiddleware, async (req, res) => {
  const { taskId } = req.params;

  try {
    const user = await User.findById(req.userId);
    const task = user.tasks.id(taskId);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    task.favorite = false;

    await user.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
