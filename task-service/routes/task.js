const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('./controllers/taskController');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Task
router.post('/', auth, createTask);

// Get All Tasks
router.get('/', auth, getTasks);

// Update Task
router.put('/:id', auth, updateTask);

// Delete Task
router.delete('/:id', auth, deleteTask);

module.exports = router;