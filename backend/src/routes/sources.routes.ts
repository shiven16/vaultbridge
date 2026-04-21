import { Router } from 'express';
import * as sourcesController from '../controllers/sources.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/files', authMiddleware, sourcesController.listFiles);
router.get('/quota', authMiddleware, sourcesController.getStorageQuota);

export default router;
