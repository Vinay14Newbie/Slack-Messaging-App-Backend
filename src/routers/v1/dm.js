import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { getPaginatedDMMEssagesController } from '../../controllers/DMMessageController.js';

const router = express.Router();

router.get('/:dmId', isAuthenticated, getPaginatedDMMEssagesController);

export default router;
