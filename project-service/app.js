const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const projectRoutes = require('./routes/projectRoutes');
const express = require('express');
const dotenv = require('dotenv');
const promClient = require('prom-client'); // Prometheus client for Node.js
const createCircuitBreaker = require('./circuit-breaker'); // 📌 Circuit Breaker
const Consul = require('consul');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012;
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:2000', 'http://localhost:1000','http://localhost:3002'], // Ajoute toutes les origines nécessaires
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
// Prometheus metrics registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Register the custom metric
register.registerMetric(httpRequestCounter);

// Middleware to collect HTTP metrics
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Expose Prometheus metrics on /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Consul Service Registration
const serviceId = `project-service-${Math.floor(Math.random() * 10000)}`;
const consul = new Consul();

consul.agent.service.register({
  name: 'project-service',
  id: serviceId,
  tags: ['api', 'v1'],
  port: 3012,
  check: {
    http: `http://localhost:${PORT}/health`,
    interval: '10s',
  }
}, (err) => {
  if (err) {
    console.error('❌ Error registering service with Consul:', err);
  } else {
    console.log(`✅ Service registered in Consul`);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/project_management')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes for Project API
app.use('/api/projects', projectRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Project Service is running on http://localhost:${PORT}`);
});

