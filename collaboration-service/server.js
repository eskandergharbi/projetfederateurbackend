const express = require('express');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chat');
const commentRoutes = require('./routes/comment');
const documentRoutes = require('./routes/document'); // Import document routes
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB(); // Calling the DB connection
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/documents', documentRoutes); // Use document routes

app.listen(PORT, () => {
    console.log(`Collaboration service running on port ${PORT}`);
});