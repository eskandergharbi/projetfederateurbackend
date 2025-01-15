const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  adresse: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true, unique:true }
});

module.exports = mongoose.model('Member', memberSchema);