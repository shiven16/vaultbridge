import { google } from 'googleapis';
import { Readable } from 'stream';
import { createOAuth2Client } from '../config/google.config.js';

import { DriveFileListResult } from './drive.service.js';

function createGmailAPI(accessToken: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function listGmailAttachments(
  accessToken: string,
  pageToken?: string,
  pageSize = 20,
): Promise<DriveFileListResult> {
  const gmail = createGmailAPI(accessToken);
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: 'has:attachment',
    maxResults: pageSize,
    pageToken: pageToken ?? undefined,
  });

  const files = [];
  for (const msg of response.data.messages || []) {
    const fullMsg = await gmail.users.messages.get({ userId: 'me', id: msg.id! });

    const headers = fullMsg.data.payload?.headers || [];
    const senderHeader = headers.find((h) => h.name?.toLowerCase() === 'from');
    const subjectHeader = headers.find((h) => h.name?.toLowerCase() === 'subject');

    let sender = senderHeader?.value || 'Unknown Sender';
    if (sender.includes('<')) {
      sender = sender.split('<')[0].trim();
    }
    const subject = subjectHeader?.value || 'No Subject';

    const parts = fullMsg.data.payload?.parts || [];
    for (const part of parts) {
      if (part.body?.attachmentId) {
        files.push({
          id: `${msg.id}|${part.body.attachmentId}`,
          name: part.filename || 'attachment',
          mimeType: part.mimeType || 'application/octet-stream',
          size: part.body.size?.toString() || '0',
          sender,
          subject,
        });
      }
    }
  }
  return { files, nextPageToken: response.data.nextPageToken || undefined };
}

export async function downloadGmailAttachmentStream(
  accessToken: string,
  id: string,
): Promise<Readable> {
  const [msgId, attachmentId] = id.split('|');
  const gmail = createGmailAPI(accessToken);
  const response = await gmail.users.messages.attachments.get({
    userId: 'me',
    messageId: msgId,
    id: attachmentId,
  });

  if (!response.data.data) {
    throw new Error('No attachment data found');
  }

  // Gmail attachment data is base64url encoded
  const base64 = response.data.data.replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Buffer.from(base64, 'base64');
  return Readable.from(buffer);
}
