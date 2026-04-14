import { google } from 'googleapis';
import { Readable } from 'stream';
import { createOAuth2Client } from '../config/google.config.js';
import { logger } from '../utils/logger.js';
import { DriveFileListResult } from './drive.service.js';

function createStorageAPI(accessToken: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.storage({ version: 'v1', auth: oauth2Client });
}

function createResourceManager(accessToken: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.cloudresourcemanager({ version: 'v1', auth: oauth2Client });
}

export async function listGCSFiles(
  accessToken: string,
  pageToken?: string,
  pageSize = 20,
): Promise<DriveFileListResult> {
  // First, find a project if possible
  const rm = createResourceManager(accessToken);
  const projectsRes = await rm.projects.list();
  const projects = projectsRes.data.projects || [];

  const files = [];

  const storage = createStorageAPI(accessToken);
  let bucketName = '';

  for (const project of projects) {
    if (!project.projectId) continue;
    try {
      const bucketsRes = await storage.buckets.list({ project: project.projectId });
      if (bucketsRes.data.items && bucketsRes.data.items.length > 0) {
        // Just take the first bucket for simplicity in this tool
        bucketName = bucketsRes.data.items[0].name || '';
        break;
      }
    } catch {
      // User might not have storage permissions on this project
      logger.info(`Could not list buckets on ${project.projectId}`);
      continue;
    }
  }

  if (bucketName) {
    const objectsRes = await storage.objects.list({
      bucket: bucketName,
      maxResults: pageSize,
      pageToken: pageToken ?? undefined,
    });

    for (const obj of objectsRes.data.items || []) {
      files.push({
        id: `${bucketName}|${obj.name}`,
        name: obj.name || 'file',
        mimeType: obj.contentType || 'application/octet-stream',
        size: obj.size || '0',
      });
    }
    return { files, nextPageToken: objectsRes.data.nextPageToken || undefined };
  }

  return { files: [], nextPageToken: undefined };
}

export async function downloadGCSStream(accessToken: string, id: string): Promise<Readable> {
  const delimiterIndex = id.indexOf('|');
  const bucket = id.substring(0, delimiterIndex);
  const objectName = id.substring(delimiterIndex + 1);

  const storage = createStorageAPI(accessToken);
  const response = await storage.objects.get(
    { bucket, object: objectName, alt: 'media' },
    { responseType: 'stream' },
  );

  return response.data as Readable;
}
