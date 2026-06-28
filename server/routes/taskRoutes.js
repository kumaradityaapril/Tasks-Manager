import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import validateTask from "../middleware/validateTask.js";


const router = express.Router();

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

router.post("/", validateTask, createTask);

export default router;