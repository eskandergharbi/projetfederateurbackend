const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const commentRoutes = require('./routes/commentRoutes');
require('dotenv').config();
const Consul = require('consul');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3007;

// ➤ Configuration Consul
const consul = new Consul();
consul.agent.service.register({
    name: 'comment-service',
    id: 'comment-service-1',
    tags: ['api', 'v1'],
    port: 3002,
    check: {
        http: `http://localhost:${PORT}/health`,
        interval: '10s',
    }
}, (err) => {
    if (err) console.error('❌ Erreur d\'enregistrement dans Consul:', err);
    else console.log('✅ Service enregistré dans Consul');
});

// ➤ Endpoint de santé
app.get('/health', (req, res) => res.status(200).send('OK'));

// ➤ Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// ➤ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));

// ➤ Routes
app.use('/api/comments', commentRoutes);

// ➤ Ajout des métriques Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Nombre total de requêtes HTTP',
    labelNames: ['method', 'route', 'status']
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// ➤ Démarrage du serveur
app.listen(PORT, () => console.log(`🚀 Service de commentaires lancé sur http://localhost:${PORT}`));
