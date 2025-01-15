const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'project_manager', 'developer'], // Allowed roles
        required: true 
    },
    dateOfBirth: { type: Date, required: true } // Required field
});

module.exports = mongoose.model('User', userSchema, 'user'); // 'user' is the collection name
