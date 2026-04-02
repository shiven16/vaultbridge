import { prisma } from '../database/prisma.js';
import * as driveService from './drive.service.js';
import * as googleService from './google.service.js';
import { logger } from '../utils/logger.js';

const MAX_CONCURRENT_TRANSFERS = 3;
const MAX_RETRY_COUNT = 5;

export interface TransferInput {
  userId: string;
  fileId: string;
  fileName: string;
  mimeType?: string;
}

export interface BatchTransferInput {
  userId: string;
  files: Array<{
    fileId: string;
    fileName: string;
    mimeType?: string;
  }>;
}

export async function processQueue(userId: string) {
  const activeTransfers = await prisma.transfer.count({
    where: {
      userId,
      status: 'in_progress',
    },
  });

  const availableSlots = MAX_CONCURRENT_TRANSFERS - activeTransfers;
  if (availableSlots <= 0) return;

  const pendingTransfers = await prisma.transfer.findMany({
    where: { userId, status: 'pending' },
    orderBy: { createdAt: 'asc' },
    take: availableSlots,
  });

  if (pendingTransfers.length === 0) return;

  await prisma.transfer.updateMany({
    where: { id: { in: pendingTransfers.map(t => t.id) } },
    data: { status: 'in_progress', startedAt: new Date() },
  });

  for (const transfer of pendingTransfers) {
    Promise.resolve()
      .then(async () => {
        const sourceToken = await googleService.getValidTokenForUser(userId, 'source');
        const destToken = await googleService.getValidTokenForUser(userId, 'destination');
        await executeTransfer(
          transfer.id,
          sourceToken,
          destToken,
          transfer.sourceFileId,
          transfer.fileName,
          'application/octet-stream',
        );
      })
      .catch((error) => {
        logger.error(`Queue Background error for ${transfer.id}:`, error);
        // Ensure failed transfers are marked failed immediately even if Google throws before executeTransfer
        prisma.transfer.update({
          where: { id: transfer.id },
          data: { status: 'failed', error: String(error), finishedAt: new Date() },
        }).catch(() => {});
      })
      .finally(() => {
        processQueue(userId).catch((err) => logger.error(`Failed to trigger next: ${err}`));
      });
  }
}

export async function initiateTransfer(input: TransferInput): Promise<string> {
  const transfer = await prisma.transfer.create({
    data: {
      userId: input.userId,
      sourceFileId: input.fileId,
      fileName: input.fileName,
      status: 'pending',
    },
  });

  processQueue(input.userId).catch((error) => {
    logger.error(`Initial queue processing failed: ${error}`);
  });

  return transfer.id;
}

export async function initiateBatchTransfer(input: BatchTransferInput): Promise<string[]> {
  const createdTransferIds: string[] = [];

  for (const file of input.files) {
    const transfer = await prisma.transfer.create({
      data: {
        userId: input.userId,
        sourceFileId: file.fileId,
        fileName: file.fileName,
        status: 'pending',
      },
    });
    createdTransferIds.push(transfer.id);
  }

  processQueue(input.userId).catch((error) => {
    logger.error(`Initial batch queue processing failed: ${error}`);
  });

  return createdTransferIds;
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
      user: true,
    },
    take: 10,
    orderBy: { createdAt: 'asc' },
  });

  if (failedTransfers.length === 0) {
    return;
  }

  logger.info(`Found ${failedTransfers.length} failed transfers to retry`);

  for (const transfer of failedTransfers) {
    // Increment retry count
    await prisma.transfer.update({
      where: { id: transfer.id },
      data: {
        retryCount: { increment: 1 },
        status: 'pending',
        error: null,
      },
    });

    processQueue(transfer.userId).catch((error) => {
      logger.error(`Retry queue trigger failed for ${transfer.id}:`, error);
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
