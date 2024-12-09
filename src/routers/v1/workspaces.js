import express from 'express';

import {
  addChannelToWorkspaceController,
  addMemberToWorksapceByEmailController,
  addMemberToWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceByIdController,
  fetchAllWorkspaceUserIsPartOfController,
  findAllWorkspacesController,
  getWorkspaceByIdController,
  getWorkspaceByJoinCodeController,
  updateWorkspaceController
} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import {
  zodAddChannelToWorkspaceSchema,
  zodAddMemberToByEmailWorkspaceSchema,
  zodAddMemberToWorkspaceSchema,
  zodCreateWorkspaceScema
} from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  validate(zodCreateWorkspaceScema),
  createWorkspaceController
);

router.get('/findAll', findAllWorkspacesController);

router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceByIdController);

router.get('/', isAuthenticated, fetchAllWorkspaceUserIsPartOfController);

router.get('/:workspaceId', isAuthenticated, getWorkspaceByIdController);

router.get(
  '/join/:joinCode',
  isAuthenticated,
  getWorkspaceByJoinCodeController
);

router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);

router.put(
  '/:workspaceId/members',
  isAuthenticated,
  validate(zodAddMemberToWorkspaceSchema),
  addMemberToWorkspaceController
);

router.put(
  '/:workspaceId/channels',
  isAuthenticated,
  validate(zodAddChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);

router.put(
  '/:workspaceId/members/email',
  isAuthenticated,
  validate(zodAddMemberToByEmailWorkspaceSchema),
  addMemberToWorksapceByEmailController
);

export default router;
