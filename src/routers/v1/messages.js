import express from 'express';

import {
  getPaginatedMessageController,
  getPresignedUrlFromAWS
} from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// In Express, routes are matched in the order they are defined. Since /:channelId is a dynamic route, it will match anything unless a more specific route (like /pre-signed-url) is defined before it.
router.get('/pre-signed-url', isAuthenticated, getPresignedUrlFromAWS);

router.get('/:channelId', isAuthenticated, getPaginatedMessageController);

export default router;
