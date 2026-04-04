import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as googleService from '../services/google.service.js';
import { prisma } from '../database/prisma.js';
import { encrypt } from '../utils/encryption.util.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

import { AppError } from '../middlewares/error.middleware.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export function login(req: Request, res: Response): void {
  const type = req.query.type as string;
  const authUrl = googleService.getAuthUrl(type || 'source');
  res.redirect(authUrl);
}

export async function callback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const code = req.query.code as string;
    const type = (req.query.type || req.query.state || 'source') as string;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Missing authorization code' });
      return;
    }

    const tokens = await googleService.getTokensFromCode(code);
    const userInfo = await googleService.getUserInfo(tokens.accessToken);
    const encryptedRefreshToken = encrypt(tokens.refreshToken);

    let user;
    let sessionToken = req.cookies?.token;

    if (type === 'destination') {
      if (!sessionToken) {
        throw new AppError('Must be logged in to connect destination account', 401);
      }
      const decoded = jwt.verify(sessionToken, env.JWT_SECRET) as { userId: string };
      user = await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          destEmail: userInfo.email,
          destAccessToken: tokens.accessToken,
          destRefreshToken: encryptedRefreshToken,
          destExpiryDate: new Date(tokens.expiryDate),
        },
      });
      logger.info(`User connected destination account: ${userInfo.email}`);
    } else {
      // Source / Primary Login
      user = await prisma.user.upsert({
        where: { googleId: userInfo.googleId },
        update: {
          email: userInfo.email,
          name: userInfo.name,
          sourceEmail: userInfo.email,
          sourceAccessToken: tokens.accessToken,
          sourceRefreshToken: encryptedRefreshToken,
          sourceExpiryDate: new Date(tokens.expiryDate),
        },
        create: {
          googleId: userInfo.googleId,
          email: userInfo.email,
          name: userInfo.name,
          sourceEmail: userInfo.email,
          sourceAccessToken: tokens.accessToken,
          sourceRefreshToken: encryptedRefreshToken,
          sourceExpiryDate: new Date(tokens.expiryDate),
        },
      });

      sessionToken = jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.cookie('token', sessionToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      logger.info(`User authenticated source account: ${userInfo.email}`);
    }

    res.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: userInfo.email,
        name: userInfo.name,
        type: type,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      sourceConnected: !!user.sourceEmail,
      sourceEmail: user.sourceEmail,
      destConnected: !!user.destEmail,
      destEmail: user.destEmail,
    });
  } catch (error) {
    next(error);
  }
}
