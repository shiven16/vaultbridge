import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../database/prisma.js';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

interface JwtPayload {
  userId: string;
  email: string;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ error: 'Missing or invalid cookie token' });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    next(error);
  }
}
