const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['to-do', 'in-progress', 'completed'],
        default: 'to-do',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ',
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);