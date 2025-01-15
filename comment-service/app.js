const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const commentRoutes = require('./routes/commentRoutes');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comment_Management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/comments', commentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Comment service running on port ${PORT}`);
});

