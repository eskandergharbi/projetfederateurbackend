const Task = require('../models/Task');
const { sendEmailNotification, logNotification } = require('./notificationService');

// Create Task
exports.createTask = async (req, res) => {
    const { title, description, priority } = req.body;
    const userId = req.user.id; // Get userId from the authenticated user
    try {
        const newTask = await Task.create({ title, description, userId, priority });
        
        // Notify the user about the new task
        logNotification(`User  ${userId} has a new task: ${newTask.title}`);
        sendEmailNotification(req.user.email, 'New Task Created', `You have created a new task: ${newTask.title}`);
        
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status, priority }, { new: true });
        
        // Notify the user about the task update
        logNotification(`User  ${updatedTask.userId} has updated the task: ${updatedTask.title}`);
        sendEmailNotification(req.user.email, 'Task Updated', `Your task has been updated: ${updatedTask.title}`);
        
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        await Task.findByIdAndDelete(id);
        
        // Notify the user about the task deletion
        logNotification(`Task with ID ${id} has been deleted.`);
        sendEmailNotification(req.user.email, 'Task Deleted', `Your task has been deleted: ${task.title}`);
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};