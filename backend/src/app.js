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
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`CondoSaaS API running on port ${env.port} [${env.nodeEnv}]`);
});

module.exports = app;
