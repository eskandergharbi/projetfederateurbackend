const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskcontroller'); // Assurez-vous que le nom est correct
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Define routes for tasks
router.post('/',authenticateToken, authorizeRole(['admin','project_manager']),taskController.createTask);
router.get('/', authenticateToken,taskController.getAllTasks);
router.get('/:id',authenticateToken, taskController.getTasksByProjectId);
router.get('/:id',authenticateToken, taskController.getTaskById);
router.put('/:id',authenticateToken, authorizeRole(['admin','project_manager']), taskController.updateTask);
router.delete('/:id',authenticateToken, authorizeRole(['admin','project_manager']), taskController.deleteTask);

module.exports = router;