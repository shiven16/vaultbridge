import app from './app.js';
import { env } from './config/env.js';
import { startRetryCron } from './cron/retry.cron.js';
import { logger } from './utils/logger.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`🚀 VaultBridge server running on port ${PORT}`);
  logger.info(`📋 Environment: ${env.NODE_ENV}`);

  // Start cron jobs
  startRetryCron();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Unhandled errors
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', { reason: String(reason) });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});
