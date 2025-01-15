const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({ origin: 'http://localhost:1000' }));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use user routes
app.use('/api/users', userRoutes);

  
  // Start the server
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });