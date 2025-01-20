const Project = require('../models/Project');


// Create a new project
exports.createProject = async (req, res) => {
  console.log('Request body:', req.body); // Log the request body
  const project = new Project(req.body);
  try {
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all projects
// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' }); // Handle case where no projects are found
    }
    // Respond with the projects
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving projects: ' + err.message }); // Handle any errors
  }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' }); // Handle case where project is not found
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving project: ' + err.message }); // Handle any errors
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ message: 'Project not found' });
  }
};
