import cron from 'node-cron';
import { retryFailedTransfers } from '../services/transfer.service.js';
import { logger } from '../utils/logger.js';

export function startRetryCron(): void {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Running retry cron job for failed transfers...');
    try {
      await retryFailedTransfers();
    } catch (error) {
      logger.error('Retry cron job failed:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  logger.info('Retry cron job scheduled: every 5 minutes');
}
