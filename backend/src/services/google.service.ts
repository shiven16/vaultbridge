import { createOAuth2Client, GOOGLE_SCOPES } from '../config/google.config.js';
import { google } from 'googleapis';
import { logger } from '../utils/logger.js';

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
