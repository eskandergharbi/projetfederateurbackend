const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const memberRoutes = require('./routes/memberRoutes');
require('./tracing'); // Initialize tracing before starting the service

const app = express();
const PORT = process.env.PORT || 3003;
const Consul = require('consul');

const consul = new Consul();  consul.agent.service.register({
  name: 'member-service', // Remplacer par le nom du service
  id: '3',     // Identifiant unique
  tags: ['api', 'v1'],
  port: 3003,
  check: {
    http: `http://localhost:${PORT}/health`,
    interval: '10s',
  }
}, (err) => {
  if (err) {
    console.error('❌ Erreur lors de l\'enregistrement du service :', err);
  } else {
    console.log(`✅ Service enregistré dans Consul`);
  }
});

// Endpoint de vérification de la santé
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/member_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/members', memberRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`member Service is running on http://localhost:${PORT}`);
});