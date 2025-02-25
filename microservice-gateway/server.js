const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { keycloak, memoryStore } = require("./keycloak-config");
require('./tracing'); // Initialize tracing before starting the service

dotenv.config();

const app = express();
const Consul = require('consul');
const PORT = process.env.PORT || 5000;

const consul = new Consul();  consul.agent.service.register({
  name: 'microservice-gateway', // Remplacer par le nom du service
  id: '4',     // Identifiant unique
  tags: ['api', 'v1'],
  port: 5000,
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
app.use(express.json());
app.use(cors());

// Middleware de session
app.use(session({
    secret: "gateway-secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
}));

// Initialisation de Keycloak
app.use(keycloak.middleware());

// Vérification des rôles via Keycloak
const checkRole = (role) => {
    return (req, res, next) => {
        const userRoles = req.kauth.grant.access_token.content.realm_access.roles;
        if (userRoles.includes(role)) {
            return next();
        }
        return res.status(403).json({ message: "⛔ Accès interdit" });
    };
};

// Route de santé
app.get("/health", (req, res) => res.send("API Gateway is running"));

// Proxy vers Auth-Service (accessible à tous)
app.use("/auth", createProxyMiddleware({
    target: "http://auth-service:3100",
    changeOrigin: true
}));

// Proxy vers Task-Service (protégé par Keycloak)
app.use("/tasks", keycloak.protect(), checkRole("developpeur"), createProxyMiddleware({
    target: "http://task-service:3200",
    changeOrigin: true
}));

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`🚀 API Gateway démarré sur http://localhost:${PORT}`);
});
