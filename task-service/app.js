const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const promClient = require('prom-client');
const dotenv = require('dotenv');
const Consul = require('consul');
const taskRoutes = require('./routes/taskRoutes');
const createCircuitBreaker = require('./circuit-breaker'); // 📌 Circuit Breaker

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:1000");  // Autoriser spécifiquement cette origine
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
      return res.sendStatus(204);
  }

  next();
});
app.use(cors());

// Prometheus metrics registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

register.registerMetric(httpRequestCounter);

// Middleware to collect HTTP metrics
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Consul Service Registration
const consul = new Consul();
consul.agent.service.register({
  name: 'task-service',
  id: '8',
  tags: ['api', 'v1'],
  port: 3010,
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
mongoose.connect('mongodb://localhost:27017/task_management')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Use task routes
app.use('/api/tasks', taskRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Task Service is running on http://localhost:${PORT}`);
});
