const Report = require('../models/Report');
const { createGanttChart, createProgressChart } = require('../utils/chartUtils'); // Utility functions for chart generation
const pdf = require('html-pdf'); // For PDF generation
const fs = require('fs');

// Generate a report
exports.generateReport = async (req, res) => {
    const { projectId } = req.body;

    try {
        // Generate charts
        const ganttChart = await createGanttChart(projectId);
        const progressChart = await createProgressChart(projectId);

        // Create report data
        const reportData = {
            ganttChart,
            progressChart,
            // Add any other relevant data
        };

        // Save report to the database
        const newReport = await Report.create({ projectId, reportData });

        // Generate PDF
        const html = `<h1>Report for Project ${projectId}</h1>
                      <h2>Gantt Chart</h2>
                      <img src="${ganttChart}" />
                      <h2>Progress Chart</h2>
                      <img src="${progressChart}" />`;

        pdf.create(html).toFile(`reports/report_${newReport._id}.pdf`, (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            res.status(201).json({ reportId: newReport._id, pdfUrl: result.filename });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reports for a project
exports.getReports = async (req, res) => {
    const { projectId } = req.params;
    try {
        const reports = await Report.find({ projectId });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};