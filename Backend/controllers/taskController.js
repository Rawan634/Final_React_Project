import Task from "../models/taskModel.js";

// GET all tasks
export const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// POST create a new task
export const addTask = async (req, res) => {
  const task = new Task(req.body);
  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

// DELETE task
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    await task.remove();
    res.json({ message: "Task removed" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

// PUT update a task
export const updateTask = async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = priority;
    task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};
