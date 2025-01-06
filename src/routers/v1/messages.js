import express from 'express';

import { getPaginatedMessageController } from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getPaginatedMessageController);

export default router;
