const express = require('express');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/project');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(); // Calling the DB connection
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
    console.log(`Project service running on port ${PORT}`);
});