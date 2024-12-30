const Project = require('../models/Project');

// Create Project
exports.createProject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newProject = await Project.create({ name, description, members: [req.user.id] });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ members: req.user.id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Project
exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description, status, progress } = req.body;
    try {
        const updatedProject = await Project.findByIdAndUpdate(id, { name, description, status, progress }, { new: true });
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await Project.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Member to Project
exports.addMember = async (req, res) => {
    const { id } = req.params;
    const { memberId } = req.body; // Assuming memberId is passed in the request body
    try {
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: "Project not found." });

        // Check if the member is already in the project
        if (project.members.includes(memberId)) {
            return res.status(400).json({ message: "Member already added to the project." });
        }

        project.members.push(memberId);
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};