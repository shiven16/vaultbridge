import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/login', authController.login);
router.get('/callback', authController.callback);
router.get('/me', authMiddleware, authController.getMe);
router.post('/disconnect', authMiddleware, authController.disconnect);

export default router;
