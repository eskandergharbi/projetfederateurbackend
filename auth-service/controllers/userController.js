const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser  = async (req, res) => {
    const { firstName, lastName, email, username, password, role, dateOfBirth } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = await User.create({ 
            firstName, 
            lastName, 
            email, 
            username, 
            password: hashedPassword, 
            role,
            dateOfBirth // Required field
        });
        res.status(201).json(newUser );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
exports.loginUser  = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User  not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};