import { Router } from 'express';
import * as transferController from '../controllers/transfer.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, transferController.createTransfer);
router.post('/batch', authMiddleware, transferController.createBatchTransfer);
router.get('/', authMiddleware, transferController.getUserTransfers);
router.get('/:id', authMiddleware, transferController.getTransferStatus);

export default router;
