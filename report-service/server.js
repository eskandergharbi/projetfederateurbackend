const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const reportRoutes = require('./routes/report');
const promClient = require('prom-client'); // Importer le client Prometheus
require('./tracing'); // Initialiser le tracing avant de démarrer le service
const app = express();
const PORT = process.env.PORT || 3006;
const Consul = require('consul');
const mongoose = require('mongoose');

// Créer des métriques pour Prometheus
const register = new promClient.Registry();

// Définir des métriques
const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Durée des requêtes HTTP',
    labelNames: ['method', 'status_code'],
    buckets: [0.1, 0.2, 0.3, 0.5, 1, 2, 5], // Intervalles de durée
});

// Ajouter cette métrique au registre de Prometheus
register.registerMetric(httpRequestDurationMicroseconds);

// Enregistrer le registre par défaut
promClient.collectDefaultMetrics({ register });

// Endpoint pour exposer les métriques de Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Créer un client Consul pour l'enregistrement du service
const consul = new Consul();
consul.agent.service.register({
  name: 'report-service',
  id: '6',
  tags: ['api', 'v1'],
  port: 3006,
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

// Middleware pour mesurer la durée des requêtes
app.use(async (req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ method: req.method, status_code: res.statusCode });
    });
    next();
});
mongoose.connect('mongodb://localhost:27017/task_management')
  .then(() => console.log('Connexion réussie'))
  .catch(err => console.error('Erreur de connexion:', err));

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Report Service en cours d'exécution sur le port ${PORT}`);
});
