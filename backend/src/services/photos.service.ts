import { Readable } from 'stream';
import { withRetry } from '../utils/retry.util.js';
import { logger } from '../utils/logger.js';
import { DriveFileListResult } from './drive.service.js';

export async function createPickerSession(accessToken: string): Promise<{ sessionId: string, pickerUri: string }> {
  const url = 'https://photospicker.googleapis.com/v1/sessions';
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  if (!response.ok) throw new Error(`Photos Picker API error: ${await response.text()}`);
  return response.json();
}

export async function listPhotos(
  accessToken: string,
  pageToken?: string,
  pageSize = 20,
  sessionId?: string
): Promise<DriveFileListResult> {
  if (!sessionId) {
    return { files: [] };
  }

  const url = new URL('https://photospicker.googleapis.com/v1/mediaItems');
  url.searchParams.append('pageSize', pageSize.toString());
  url.searchParams.append('sessionId', sessionId);
  if (pageToken) url.searchParams.append('pageToken', pageToken);

  const response = await withRetry(
    async () => {
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error(`Photos Picker list error: ${await res.text()}`);
      return res.json();
    },
    { maxRetries: 3 },
  );

  return {
    files: (response.mediaItems ?? []).map((m: any) => ({
      id: m.mediaFile.id,
      name: m.mediaFile.filename ?? 'photo.jpg',
      mimeType: m.mediaFile.mimeType ?? 'image/jpeg',
      size: '0',
    })),
    nextPageToken: response.nextPageToken,
  };
}

export async function downloadPhotoStream(accessToken: string, fileId: string): Promise<Readable> {
  logger.info(`Starting photo download stream for fileId: ${fileId}`);
  const url = `https://photospicker.googleapis.com/v1/mediaItems/${fileId}`;

  const mediaItem = await withRetry(
    async () => {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (!res.ok) throw new Error(`Photos API get metadata error: ${await res.text()}`);
      return res.json();
    },
    { maxRetries: 3 },
  );

  let downloadUrl = mediaItem.mediaFile.baseUrl;
  if (mediaItem.mediaFile.video) {
    downloadUrl += '=dv';
  } else {
    downloadUrl += '=d';
  }

  const res = await fetch(downloadUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Photos download error: ${await res.text()}`);

  return Readable.fromWeb(res.body as any);
}
