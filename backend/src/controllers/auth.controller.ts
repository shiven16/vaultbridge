import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as googleService from '../services/google.service.js';
import { prisma } from '../database/prisma.js';
import { encrypt } from '../utils/encryption.util.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function login(_req: Request, res: Response): void {
  const authUrl = googleService.getAuthUrl();
  res.redirect(authUrl);
}

export async function callback(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Missing authorization code' });
      return;
    }

    // Exchange code for tokens
    const tokens = await googleService.getTokensFromCode(code);

    // Get user info
    const userInfo = await googleService.getUserInfo(tokens.accessToken);

    // Upsert user
    const user = await prisma.user.upsert({
      where: { googleId: userInfo.googleId },
      update: {
        email: userInfo.email,
        name: userInfo.name,
      },
      create: {
        googleId: userInfo.googleId,
        email: userInfo.email,
        name: userInfo.name,
      },
    });

    // Encrypt refresh token before storing
    const encryptedRefreshToken = encrypt(tokens.refreshToken);

    // Upsert token record
    await prisma.token.upsert({
      where: {
        id: (
          await prisma.token.findFirst({ where: { userId: user.id } })
        )?.id ?? '',
      },
      update: {
        accessToken: tokens.accessToken,
        refreshToken: encryptedRefreshToken,
        expiryDate: new Date(tokens.expiryDate),
      },
      create: {
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: encryptedRefreshToken,
        expiryDate: new Date(tokens.expiryDate),
      },
    });

    // Generate JWT session token
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    logger.info(`User authenticated: ${user.email}`);

    res.json({
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
}
