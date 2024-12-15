import express from 'express';

import { checkIfUserMemberOfWorkspaceController } from '../../controllers/memberController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/:workspaceId',
  isAuthenticated,
  checkIfUserMemberOfWorkspaceController
);

export default router;
