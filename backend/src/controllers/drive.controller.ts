import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import * as driveService from '../services/drive.service.js';

const listFilesSchema = z.object({
  pageToken: z.string().optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  accessToken: z.string().min(1, 'accessToken is required'),
});

export async function listFiles(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = listFilesSchema.parse(req.query);

    const result = await driveService.listFiles(query.accessToken, query.pageToken, query.pageSize);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
