const express = require('express');
const { generateReport, getReports } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const router = express.Router();

// Generate a report
router.post('/', auth, generateReport);

// Get reports for a project
router.get('/:projectId', auth, getReports);

module.exports = router;