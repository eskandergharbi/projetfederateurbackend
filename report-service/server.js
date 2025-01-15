const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Project = require('./models/project.model');
const Task = require('./models/task.model');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/project-tracking', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(cors());
app.use(bodyParser.json());

// Create a new project
app.post('/api/projects', async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.status(201).json(project);
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find().populate('tasks');
  res.json(projects);
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  await Project.findByIdAndUpdate(req.body.projectId, { $push: { tasks: task._id } });
  res.status(201).json(task);
});

// Get all tasks for a project
app.get('/api/projects/:projectId/tasks', async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId });
  res.json(tasks);
});

// Get project statistics
app.get('/api/projects/statistics', async (req, res) => {
  const projects = await Project.find().populate('tasks');
  const projectStats = projects.map(project => ({
    name: project.name,
    status: project.status,
    progress: project.progress,
    taskCount: project.tasks.length,
    completedTasks: project.tasks.filter(task => task.status === 'completed').length,
    inProgressTasks: project.tasks.filter(task => task.status === 'in progress').length,
    notStartedTasks: project.tasks.filter(task => task.status === 'not started').length,
  }));
  res.json(projectStats);
});

// Get task statistics
app.get('/api/tasks/statistics', async (req, res) => {
  const tasks = await Task.find();
  const taskStats = {
    totalTasks: tasks.length,
    completedTasks:tasks.filter(task => task.status === 'completed').length,
    inProgressTasks: tasks.filter(task => task.status === 'in progress').length,
    notStartedTasks: tasks.filter(task => task.status === 'not started').length,
  };
  res.json(taskStats);
});