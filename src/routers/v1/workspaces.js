import express from 'express';

import {
  createWorkspaceController,
  deleteWorkspaceById,
  findAllWorkspaces
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

router.get('/', findAllWorkspaces);

router.delete('/', deleteWorkspaceById);

export default router;
