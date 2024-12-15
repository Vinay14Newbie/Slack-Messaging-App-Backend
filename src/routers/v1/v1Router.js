import express from 'express';

import useChannel from './channels.js';
import memberRouter from './members.js';
import userRouter from './users.js';
import workspaceRouter from './workspaces.js';

const router = express.Router();

router.use('/users', userRouter);

router.use('/workspaces', workspaceRouter);

router.use('/channels', useChannel);

router.use('/members', memberRouter);

export default router;
