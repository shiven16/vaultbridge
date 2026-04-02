import { createOAuth2Client, GOOGLE_SCOPES } from '../config/google.config.js';
import { google } from 'googleapis';
import { logger } from '../utils/logger.js';
import { prisma } from '../database/prisma.js';
import { decrypt } from '../utils/encryption.util.js';
import { AppError } from '../middlewares/error.middleware.js';

export function getAuthUrl(state?: string): string {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_SCOPES,
    prompt: 'consent',
    state: state,
  });
}

export interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
}

export async function getTokensFromCode(code: string): Promise<GoogleTokens> {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error('Failed to obtain tokens from Google');
  }

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiryDate: tokens.expiry_date ?? Date.now() + 3600 * 1000,
  };
}

export interface GoogleUserInfo {
  googleId: string;
  email: string;
  name: string;
}

export async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  if (!data.id || !data.email) {
    throw new Error('Failed to get user info from Google');
  }

  return {
    googleId: data.id,
    email: data.email,
    name: data.name ?? '',
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiryDate: number;
}> {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();

  if (!credentials.access_token) {
    throw new Error('Failed to refresh access token');
  }

  logger.info('Successfully refreshed access token');

  return {
    accessToken: credentials.access_token,
    expiryDate: credentials.expiry_date ?? Date.now() + 3600 * 1000,
  };
}

export async function getValidTokenForUser(userId: string, type: 'source' | 'destination'): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const token = type === 'source' ? user.sourceAccessToken : user.destAccessToken;
  const refreshTokenEnc = type === 'source' ? user.sourceRefreshToken : user.destRefreshToken;
  const expiry = type === 'source' ? user.sourceExpiryDate : user.destExpiryDate;

  if (!token || !refreshTokenEnc || !expiry) {
    throw new AppError(`${type} account not connected`, 400);
  }

  // Refresh if less than 5 minutes left
  if (expiry.getTime() - Date.now() < 5 * 60 * 1000) {
    const plainRefresh = decrypt(refreshTokenEnc);
    const newCreds = await refreshAccessToken(plainRefresh);

    const updateData = type === 'source' ? {
      sourceAccessToken: newCreds.accessToken,
      sourceExpiryDate: new Date(newCreds.expiryDate),
    } : {
      destAccessToken: newCreds.accessToken,
      destExpiryDate: new Date(newCreds.expiryDate),
    };

    await prisma.user.update({ where: { id: userId }, data: updateData });
    return newCreds.accessToken;
  }

  return token;
}
