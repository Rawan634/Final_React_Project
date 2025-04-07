const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Add Task Route
router.post("/tasks", async (req, res) => {
  const { userId, task } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.tasks.push(task); // Add the task to the user's task array
    await user.save();

    res.json({ task: user.tasks[user.tasks.length - 1] });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Update Task Route
router.put("/tasks/:taskId", async (req, res) => {
  const { userId, updatedTask } = req.body;
  const { taskId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const taskIndex = user.tasks.findIndex((task) => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ msg: "Task not found" });
    }

    user.tasks[taskIndex] = updatedTask; // Update the task
    await user.save();

    res.json({ task: user.tasks[taskIndex] });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete Task Route
router.delete("/tasks/:taskId", async (req, res) => {
  const { userId } = req.body;
  const { taskId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.tasks = user.tasks.filter((task) => task._id.toString() !== taskId); // Remove the task
    await user.save();

    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
