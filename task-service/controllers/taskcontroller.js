const Task = require('../models/Task'); 
const { sendEmailNotification } = require('./notificationService'); // Importer le service de notification
const axios = require('axios');

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, project, status } = req.body;

    if (!title || !assignedTo || !project) {
      return res.status(400).json({ message: 'Title, assignedTo, and project are required.' });
    }

    const task = new Task({ title, description, assignedTo, priority, project, status });
    const savedTask = await task.save();

    // Get assigned member details
    const response = await axios.get(`http://localhost:3003/api/members/${assignedTo}`);
    const member = response.data;

    sendEmailNotification(
      member.email,
      '🆕 New Task Assigned',
      `You have been assigned a new task: ${title}`
    );

    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks by project ID
exports.getTasksByProjectId = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const memberResponse = await axios.get(`http://localhost:3003/api/members/${updatedTask.assignedTo}`);
    const member = memberResponse.data;

    sendEmailNotification(
      member.email,
      '✏️ Task Updated',
      `Your task has been updated: ${updatedTask.title}`
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Task not found' });
  }
};
