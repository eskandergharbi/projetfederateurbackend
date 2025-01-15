const mongoose = require('mongoose');
// Define the Member schema
const memberSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB ObjectID as the primary key
  name: { type: String, required: true }, // Combined name field
  email: { type: String, required: true, unique: true }, // Unique email field
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], // Array of Project IDs
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Array of Task IDs
});

// Export the Member model
module.exports = mongoose.model('Member', memberSchema);
