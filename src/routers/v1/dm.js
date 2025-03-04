import express from 'express';

import { getPaginatedDMMEssagesController } from '../../controllers/DMMessageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:memberId', isAuthenticated, getPaginatedDMMEssagesController);

export default router;
