import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { getPaginatedMessageController } from '../../controllers/messageController.js';

const router = express.Router();

router.get(
  '/messages/:channelId',
  isAuthenticated,
  getPaginatedMessageController
);

export default router;
