const express = require('express');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/report'); // Import report routes
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

connectDB(); // Calling the DB connection
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
    console.log(`Report service running on port ${PORT}`);
});