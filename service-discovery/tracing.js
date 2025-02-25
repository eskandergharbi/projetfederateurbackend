const opentelemetry = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto'); // ✅ Nouveau exporteur

// Création du fournisseur de traces avec OTLP
const provider = new NodeTracerProvider({
  spanProcessors: [
    new SimpleSpanProcessor(new OTLPTraceExporter({ // ✅ Remplacement de JaegerExporter
      url: 'http://localhost:4318/v1/traces', // URL de l'endpoint OTLP de Jaeger
    })),
    new SimpleSpanProcessor(new ConsoleSpanExporter()), // Debug en console
  ],
});

// Enregistrer le provider
provider.register();

// Initialiser le SDK OpenTelemetry
const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({ // ✅ Utilisation de OTLP
    url: 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [new HttpInstrumentation()],
});

sdk.start()
  .then(() => console.log('✅ OpenTelemetry Tracing initialisé avec OTLP'))
  .catch((error) => console.error('❌ Erreur OpenTelemetry:', error));
