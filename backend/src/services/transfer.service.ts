import { prisma } from '../database/prisma.js';
import * as driveService from './drive.service.js';
import { logger } from '../utils/logger.js';

const MAX_CONCURRENT_TRANSFERS = 3;
const MAX_RETRY_COUNT = 5;

export interface TransferInput {
  userId: string;
  sourceAccessToken: string;
  destinationAccessToken: string;
  fileId: string;
  fileName: string;
  mimeType?: string;
}

export async function initiateTransfer(input: TransferInput): Promise<string> {
  // Check concurrency limit
  const activeTransfers = await prisma.transfer.count({
    where: {
      userId: input.userId,
      status: 'in_progress',
    },
  });

  if (activeTransfers >= MAX_CONCURRENT_TRANSFERS) {
    throw new Error(
      `Maximum concurrent transfers (${MAX_CONCURRENT_TRANSFERS}) reached. Please wait for current transfers to complete.`,
    );
  }

  // Create transfer record
  const transfer = await prisma.transfer.create({
    data: {
      userId: input.userId,
      sourceFileId: input.fileId,
      fileName: input.fileName,
      status: 'in_progress',
      startedAt: new Date(),
    },
  });

  // Execute transfer in the background (fire-and-forget)
  executeTransfer(
    transfer.id,
    input.sourceAccessToken,
    input.destinationAccessToken,
    input.fileId,
    input.fileName,
    input.mimeType ?? 'application/octet-stream',
  ).catch((error) => {
    logger.error(`Background transfer failed for ${transfer.id}:`, {
      error: error instanceof Error ? error.message : String(error),
    });
  });

  return transfer.id;
}

async function executeTransfer(
  transferId: string,
  sourceAccessToken: string,
  destinationAccessToken: string,
  fileId: string,
  fileName: string,
  mimeType: string,
): Promise<void> {
  try {
    logger.info(`Executing transfer ${transferId}: ${fileName}`);

    // Step 1: Download file as a stream from source account
    const downloadStream = await driveService.downloadFileStream(sourceAccessToken, fileId);

    // Step 2: Pipe the stream directly to upload on destination account
    const uploadedFileId = await driveService.uploadFileStream(
      destinationAccessToken,
      downloadStream,
      fileName,
      mimeType,
    );

    // Step 3: Mark transfer as successful
    await prisma.transfer.update({
      where: { id: transferId },
      data: {
        status: 'success',
        finishedAt: new Date(),
      },
    });

    logger.info(`Transfer ${transferId} completed. Uploaded file ID: ${uploadedFileId}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Transfer ${transferId} failed: ${errorMessage}`);

    await prisma.transfer.update({
      where: { id: transferId },
      data: {
        status: 'failed',
        error: errorMessage,
        finishedAt: new Date(),
      },
    });
  }
}

export async function retryFailedTransfers(): Promise<void> {
  const failedTransfers = await prisma.transfer.findMany({
    where: {
      status: 'failed',
      retryCount: { lt: MAX_RETRY_COUNT },
    },
    include: {
      user: {
        include: {
          tokens: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: 'asc' },
  });

  if (failedTransfers.length === 0) {
    return;
  }

  logger.info(`Found ${failedTransfers.length} failed transfers to retry`);

  for (const transfer of failedTransfers) {
    // Need at least 2 tokens (source + destination accounts)
    if (transfer.user.tokens.length < 2) {
      logger.warn(`User ${transfer.userId} has insufficient tokens for retry`);
      continue;
    }

    // Increment retry count
    await prisma.transfer.update({
      where: { id: transfer.id },
      data: {
        retryCount: { increment: 1 },
        status: 'in_progress',
        error: null,
        startedAt: new Date(),
        finishedAt: null,
      },
    });

    // Use the first two tokens as source and destination
    const [sourceToken, destToken] = transfer.user.tokens;

    executeTransfer(
      transfer.id,
      sourceToken.accessToken,
      destToken.accessToken,
      transfer.sourceFileId,
      transfer.fileName,
      'application/octet-stream',
    ).catch((error) => {
      logger.error(`Retry transfer failed for ${transfer.id}:`, {
        error: error instanceof Error ? error.message : String(error),
      });
    });

    // Add delay between retries to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

export async function getTransferById(transferId: string) {
  return prisma.transfer.findUnique({
    where: { id: transferId },
  });
}

export async function getUserTransfers(userId: string) {
  return prisma.transfer.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
