import { google } from 'googleapis';
import { Readable } from 'stream';
import { createOAuth2Client } from '../config/google.config.js';
import { withRetry } from '../utils/retry.util.js';
import { logger } from '../utils/logger.js';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
}

export interface DriveFileListResult {
  files: DriveFile[];
  nextPageToken?: string;
}

function createAuthenticatedDrive(accessToken: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth: oauth2Client });
}

export async function listFiles(
  accessToken: string,
  pageToken?: string,
  pageSize = 20,
): Promise<DriveFileListResult> {
  const drive = createAuthenticatedDrive(accessToken);

  const response = await withRetry(
    () =>
      drive.files.list({
        pageSize,
        pageToken: pageToken ?? undefined,
        fields: 'nextPageToken, files(id, name, mimeType, size)',
        q: "trashed = false and mimeType != 'application/vnd.google-apps.folder'",
        orderBy: 'modifiedTime desc',
      }),
    { maxRetries: 3 },
  );

  return {
    files: (response.data.files ?? []).map((f) => ({
      id: f.id ?? '',
      name: f.name ?? '',
      mimeType: f.mimeType ?? '',
      size: f.size ?? '0',
    })),
    nextPageToken: response.data.nextPageToken ?? undefined,
  };
}

export async function downloadFileStream(accessToken: string, fileId: string): Promise<Readable> {
  const drive = createAuthenticatedDrive(accessToken);

  logger.info(`Starting file download stream for fileId: ${fileId}`);

  const response = await withRetry(
    () => drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' }),
    { maxRetries: 3 },
  );

  return response.data as Readable;
}

export async function uploadFileStream(
  accessToken: string,
  fileStream: Readable,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const drive = createAuthenticatedDrive(accessToken);

  logger.info(`Starting file upload stream for: ${fileName}`);

  const response = await withRetry(
    () =>
      drive.files.create({
        requestBody: {
          name: fileName,
          mimeType,
        },
        media: {
          mimeType,
          body: fileStream,
        },
        fields: 'id',
      }),
    { maxRetries: 2 },
  );

  const uploadedFileId = response.data.id;
  if (!uploadedFileId) {
    throw new Error('Upload succeeded but no file ID returned');
  }

  logger.info(`File uploaded successfully with ID: ${uploadedFileId}`);

  return uploadedFileId;
}

export async function deleteFile(accessToken: string, fileId: string): Promise<void> {
  const drive = createAuthenticatedDrive(accessToken);

  logger.info(`Deleting source file: ${fileId}`);

  await withRetry(() => drive.files.delete({ fileId }), { maxRetries: 3 });

  logger.info(`Source file ${fileId} deleted successfully`);
}
