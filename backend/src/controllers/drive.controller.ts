import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import * as driveService from '../services/drive.service.js';
import * as googleService from '../services/google.service.js';
import { AppError } from '../middlewares/error.middleware.js';

const listFilesSchema = z.object({
  pageToken: z.string().optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  type: z.enum(['source', 'destination']).default('source'),
});

export async function listFiles(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }
    const query = listFilesSchema.parse(req.query);
    const accessToken = await googleService.getValidTokenForUser(req.userId, query.type);

    const result = await driveService.listFiles(accessToken, query.pageToken, query.pageSize);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
