import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import driveRoutes from './routes/drive.routes.js';
import transferRoutes from './routes/transfer.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: true, credentials: true })); // Important for cookies!
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
app.use('/transfer', transferRoutes);

// Error handling (must be last)
app.use(errorMiddleware);

export default app;
