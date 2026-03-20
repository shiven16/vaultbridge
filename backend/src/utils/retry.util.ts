import { logger } from './logger.js';

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
};

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Google API rate limit errors
    if (message.includes('ratelimitexceeded') || message.includes('rate limit')) {
      return true;
    }
  }

  // Check for HTTP status code patterns
  if (typeof error === 'object' && error !== null) {
    const statusCode =
      (error as Record<string, unknown>).code ?? (error as Record<string, unknown>).status;
    if (typeof statusCode === 'number') {
      // Retry on 429 (Too Many Requests) and 5xx errors
      if (statusCode === 429 || (statusCode >= 500 && statusCode < 600)) {
        return true;
      }
    }
  }

  return false;
}

function calculateDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  // Exponential backoff with jitter
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * baseDelayMs;
  return Math.min(exponentialDelay + jitter, maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === opts.maxRetries) {
        break;
      }

      if (!isRetryableError(error)) {
        logger.warn(`Non-retryable error on attempt ${attempt + 1}`, {
          error: error instanceof Error ? error.message : String(error),
        });
        break;
      }

      const delay = calculateDelay(attempt, opts.baseDelayMs, opts.maxDelayMs);
      logger.info(
        `Retrying after ${Math.round(delay)}ms (attempt ${attempt + 1}/${opts.maxRetries})`,
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );

      await sleep(delay);
    }
  }

  throw lastError;
}
