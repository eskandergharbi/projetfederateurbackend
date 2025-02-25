const CircuitBreaker = require('opossum');

// Function to wrap API calls with circuit breaker
function createCircuitBreaker(requestFunction, options = {}) {
    const defaultOptions = {
        timeout: 3000, // Timeout for requests (3s)
        errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
        resetTimeout: 5000, // Try again after 5s
        ...options
    };

    const breaker = new CircuitBreaker(requestFunction, defaultOptions);

    breaker.fallback(() => {
        return { error: true, message: 'Service unavailable. Please try again later.' };
    });

    breaker.on('open', () => console.warn('⚠️ Circuit breaker OPEN: Service is failing.'));
    breaker.on('halfOpen', () => console.info('🔄 Circuit breaker HALF-OPEN: Retrying...'));
    breaker.on('close', () => console.info('✅ Circuit breaker CLOSED: Service is healthy.'));

    return breaker;
}

module.exports = createCircuitBreaker;
