import ModelTask from "../models/task.js";

const tasksController = {};

tasksController.getAllTasks = async (req, res) => {
    try {
        const tasks = await ModelTask.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ message: "Internal server error" });
    }
};

tasksController.insertTask = async (req, res) => {
    const { title, description, completed } = req.body;

    try {
        if (!title || !description || completed === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTask = new ModelTask({ title, description, completed });
        await newTask.save();

        return res.status(200).json({ message: "Task saved successfully" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

tasksController.updateTask = async (req, res) => {
    const { title, description, completed } = req.body;

    try {
        if (!title || !description || completed === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedTask = await ModelTask.findByIdAndUpdate(
            req.params.id,
            { title, description, completed },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

tasksController.deleteTask = async (req, res) => {
    try {
        const deletedTask = await ModelTask.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

tasksController.getTaskById = async (req, res) => {
    try {
        const task = await ModelTask.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default tasksController;