import { Router } from 'express';
import * as driveController from '../controllers/drive.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/files', authMiddleware, driveController.listFiles);
router.get('/quota', authMiddleware, driveController.getStorageQuota);

export default router;
