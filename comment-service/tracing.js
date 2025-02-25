const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');  // Use this exporter
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { MongooseInstrumentation } = require('@opentelemetry/instrumentation-mongoose');

// Exporteur Zipkin pour envoyer les traces vers Zipkin
const zipkinExporter = new ZipkinExporter({
  serviceName: 'comment-service',  // Nom de votre service
  url: 'http://localhost:9411/api/v2/spans', // URL de votre serveur Zipkin
});

// Création du SDK OpenTelemetry
const sdk = new NodeSDK({
  traceExporter: zipkinExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new MongooseInstrumentation(),
  ],
});

// 🚀 Démarrer le SDK
sdk.start();
console.log('✅ OpenTelemetry Tracing initialisé avec Zipkin');

// Accéder au TracerProvider après le démarrage
const tracerProvider = sdk.tracerProvider;
if (tracerProvider) {
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
} else {
  console.error('❌ TracerProvider non initialisé !');
}

// 🛑 Arrêter proprement OpenTelemetry lors de la fermeture de l'application
process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    console.log('🛑 OpenTelemetry fermé proprement');
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt OpenTelemetry:', error);
  } finally {
    process.exit(0);
  }
});
