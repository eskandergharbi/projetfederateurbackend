const Chat = require('../models/Chat');

// Send a message
exports.sendMessage = async (req, res) => {
    const { projectId, message } = req.body;
    const senderId = req.user.id; // Get userId from the authenticated user
    try {
        const newMessage = await Chat.create({ projectId, senderId, message });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get messages for a project
exports.getMessages = async (req, res) => {
    const { projectId } = req.params;
    try {
        const messages = await Chat.find({ projectId }).populate('senderId', 'name'); // Populate senderId with user name
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};