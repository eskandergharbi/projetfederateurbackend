const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const userRoutes = require('./routes/userRoutes');
require('./tracing'); // Initialiser le tracing avant le démarrage
const promClient = require('prom-client'); // 📌 Ajout de Prometheus
const createCircuitBreaker = require('./circuit-breaker'); // 📌 Circuit Breaker

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3100;
const Consul = require('consul');
const consul = new Consul();
app.options('*', cors()); // Permet toutes les requêtes OPTIONS

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:1000','http://localhost:3002'], // Autoriser les requêtes du frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Inclure OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true // Si tu utilises des cookies ou des sessions
}));

// 📌 Initialiser un registre Prometheus
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// 📌 Définir un compteur de requêtes
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestCounter);

// 📌 Middleware pour collecter les métriques des requêtes
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// 📌 Endpoint des métriques pour Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// 📌 Enregistrement du service dans Consul
consul.agent.service.register({
  name: 'auth-service',
  id: '1',
  tags: ['api', 'v1'],
  port: 3100,
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

// 📌 Endpoint de santé
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 📌 Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connecté'))
    .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// 📌 Route publique
app.get("/", (req, res) => {
  res.send("Bienvenue dans l’Auth-Service !");
});

// 📌 Création de la fonction pour récupérer le token Keycloak avec Circuit Breaker
const keycloakAuth = async () => {
  const authResponse = await axios.post(`${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, 
    new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }), 
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return authResponse.data.access_token;
};

// 📌 Créer un circuit breaker pour la requête Keycloak
const keycloakBreaker = createCircuitBreaker(keycloakAuth);



// 📌 Routes utilisateurs
app.use('/api/users', userRoutes);

// 📌 Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Auth-Service fonctionne sur http://localhost:${PORT}`);
});
