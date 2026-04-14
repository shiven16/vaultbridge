import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import driveRoutes from './routes/drive.routes.js';
import sourcesRoutes from './routes/sources.routes.js';
import transferRoutes from './routes/transfer.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

import { env } from './config/env.js';

// Force restart node process to load updated Prisma Client
const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL || true,
    credentials: true,
  }),
); // Restricts CORS if FRONTEND_URL is provided, else reflects origin
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Body parsing
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/drive', driveRoutes);
app.use('/sources', sourcesRoutes);
app.use('/transfer', transferRoutes);

// Error handling (must be last)
app.use(errorMiddleware);

export default app;
