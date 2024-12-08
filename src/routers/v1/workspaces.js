import express from 'express';

import {
  createWorkspaceController,
  deleteWorkspaceByIdController,
  fetchAllWorkspaceUserIsPartOfController,
  findAllWorkspacesController,
  getWorkspaceByIdController
} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { zodCreateWorkspaceScema } from '../../validators/workspaceSchema.js';
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

export default router;
