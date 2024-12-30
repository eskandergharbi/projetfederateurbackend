const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/task');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

connectDB(); // Calling the DB connection
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Task service running on port ${PORT}`);
});