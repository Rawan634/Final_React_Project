import express from "express";
import {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.route("/").get(getTasks).post(addTask);
router.route("/:id").delete(deleteTask).put(updateTask);

export default router;
