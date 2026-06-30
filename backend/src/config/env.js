const dotenv = require('dotenv');
dotenv.config();

const env = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  databaseUrl: process.env.DATABASE_URL,
};

if (!env.jwt.secret) {
  throw new Error('JWT_SECRET environment variable is required');
}

module.exports = env;
