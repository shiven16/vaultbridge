import { Router } from 'express';
import * as sourcesController from '../controllers/sources.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/files', authMiddleware, sourcesController.listFiles);
router.post('/photos/session', authMiddleware, sourcesController.createPhotosSession);

export default router;
