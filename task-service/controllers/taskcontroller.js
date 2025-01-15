const Task = require('../models/Task');
const { sendEmailNotification } = require('./notificationService'); // Importer le service de notification
const axios = require('axios');

// Create a new task
exports.createTask = async (req, res) => {
  const task = new Task(req.body);
  try {
    const savedTask = await task.save();
  

 // Fetch member details from the Member service
 const memberResponse = await axios.get(`http://localhost:3003/api/members/${savedTask.assignedTo}`);
 const memberDetails = memberResponse.data;

 // Send notification email
 sendEmailNotification(
   memberDetails.email,
   'New Task Assigned',
   `You have been assigned a new task: ${savedTask.title}`
 );

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks and populate assignedTo field

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' }); // Handle case where no tasks are found
    }

    // Respond with the tasks, including the assignedTo field
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle any errors
  }
};

// Get a task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); // Fetch task from the database

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Respond with the task as is, including the assignedTo field (idMember)
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update a task
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Send notification email to the assigned user
    sendEmailNotification(updatedTask.assignedTo, 'Tâche mise à jour', `La tâche a été mise à jour : ${updatedTask.title}`);
 // Fetch member details from the Member service
 const memberResponse = await axios.get(`http://localhost:3003/api/members/${updatedTask.assignedTo}`);
 const memberDetails = memberResponse.data;

 // Send notification email
 sendEmailNotification(
   memberDetails.email,
   'Tâche mise à jour', `La tâche a été mise à jour : ${updatedTask.title}`
 );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ message: 'Task not found' });
  }
};