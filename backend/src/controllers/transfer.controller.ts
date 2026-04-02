import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import * as transferService from '../services/transfer.service.js';
import { AppError } from '../middlewares/error.middleware.js';

const createTransferSchema = z.object({
  sourceAccessToken: z.string().min(1, 'sourceAccessToken is required'),
  destinationAccessToken: z.string().min(1, 'destinationAccessToken is required'),
  fileId: z.string().min(1, 'fileId is required'),
  fileName: z.string().min(1, 'fileName is required'),
  mimeType: z.string().optional(),
});

const createBatchTransferSchema = z.object({
  sourceAccessToken: z.string().min(1, 'sourceAccessToken is required'),
  destinationAccessToken: z.string().min(1, 'destinationAccessToken is required'),
  files: z.array(z.object({
    fileId: z.string().min(1, 'fileId is required'),
    fileName: z.string().min(1, 'fileName is required'),
    mimeType: z.string().optional(),
  })).min(1, 'At least one file is required'),
});

export async function createTransfer(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const body = createTransferSchema.parse(req.body);

    const transferId = await transferService.initiateTransfer({
      userId: req.userId,
      sourceAccessToken: body.sourceAccessToken,
      destinationAccessToken: body.destinationAccessToken,
      fileId: body.fileId,
      fileName: body.fileName,
      mimeType: body.mimeType,
    });

    res.status(202).json({
      message: 'Transfer initiated',
      transferId,
    });
  } catch (error) {
    next(error);
  }
}

export async function createBatchTransfer(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const body = createBatchTransferSchema.parse(req.body);

    const transferIds = await transferService.initiateBatchTransfer({
      userId: req.userId,
      sourceAccessToken: body.sourceAccessToken,
      destinationAccessToken: body.destinationAccessToken,
      files: body.files,
    });

    res.status(202).json({
      message: 'Batch transfers initiated in the queue',
      transferIds,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTransferStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const id = req.params.id as string;

    const transfer = await transferService.getTransferById(id);

    if (!transfer) {
      throw new AppError('Transfer not found', 404);
    }

    if (transfer.userId !== req.userId) {
      throw new AppError('Forbidden', 403);
    }

    res.json(transfer);
  } catch (error) {
    next(error);
  }
}

export async function getUserTransfers(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const transfers = await transferService.getUserTransfers(req.userId);

    res.json({ transfers });
  } catch (error) {
    next(error);
  }
}
