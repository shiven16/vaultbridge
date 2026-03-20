import winston from 'winston';

const tokenRedactFormat = winston.format((info) => {
  if (typeof info.message === 'string') {
    // Redact anything that looks like a token
    const msg = info.message as string;
    info.message = msg
      .replace(/ya29\.[A-Za-z0-9_-]+/g, '[REDACTED_ACCESS_TOKEN]')
      .replace(/1\/[A-Za-z0-9_-]+/g, '[REDACTED_REFRESH_TOKEN]');
  }
  return info;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    tokenRedactFormat(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'vaultbridge' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr =
            Object.keys(meta).length > 1 // 1 because 'service' is default
              ? ` ${JSON.stringify(meta)}`
              : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        }),
      ),
    }),
  ],
});
