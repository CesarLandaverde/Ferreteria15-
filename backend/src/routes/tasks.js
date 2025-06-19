import express from "express";

const router = express.Router();

import taskController from "../controllers/tasksController.js";


router.route("/")
.get(taskController.getAllTasks)
.post(taskController.insertTask);

router.route("/:id")
.put(taskController.updateTask)
.delete(taskController.deleteTask)
.get(taskController.getTaskById);


export default router;