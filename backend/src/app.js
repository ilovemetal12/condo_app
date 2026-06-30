const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const corsOptions = require('./config/cors');
const errorHandler = require('./shared/middlewares/error-handler.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const tenantRoutes = require('./modules/tenants/tenant.routes');

const app = express();

// Security & parsing
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);

// Serve frontend static files (built by Vite into ../frontend/dist)
const clientDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(clientDistPath));

// SPA fallback: any non-API route returns index.html
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(env.port, '0.0.0.0', () => {
  console.log(`CondoSaaS API running on port ${env.port} [${env.nodeEnv}]`);
});

module.exports = app;
