const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:3000', changeOrigin: true }));
app.use('/projects', createProxyMiddleware({ target: 'http://project-service:3001', changeOrigin: true }));
app.use('/tasks', createProxyMiddleware({ target: 'http://task-service:3002', changeOrigin: true }));
app.use('/reports', createProxyMiddleware({ target: 'http://report-service:3003', changeOrigin: true }));
app.use('/chat', createProxyMiddleware({ target: 'http://chat-service:3004', changeOrigin: true }));

app.listen(3005, () => {
    console.log('API Gateway running on port 3005');
});