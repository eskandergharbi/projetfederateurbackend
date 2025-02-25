const express = require('express');
const Consul = require('consul'); // Importer la classe Consul
const consul = new Consul(); // Créer une instance de Consul
const app = express();
const port = 3009;
require('./tracing'); // Initialize tracing before starting the service

// Enregistrement du service dans Consul
consul.agent.service.register({
  name: 'service-discovery', // Nom du service
  id: '7', // Identifiant unique
  tags: ['api', 'v1'],
  port: port,
  check: {
    http: `http://localhost:${port}/health`, // Endpoint pour vérifier la santé
    interval: '10s'
  }
}, (err) => {
  if (err) {
    console.error('Erreur lors de l\'enregistrement du service :', err);
  }
});

// Exemple d'API avec un endpoint de santé
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Service en cours d'exécution sur le port ${port}`);
});
