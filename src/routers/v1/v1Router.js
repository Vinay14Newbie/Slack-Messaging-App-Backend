import express from 'express';

import useChannel from './channels.js';
import memberRouter from './members.js';
import messageRouter from './messages.js';
import paymentRouter from './payment.js';
import userRouter from './users.js';
import workspaceRouter from './workspaces.js';

const router = express.Router();

router.use('/users', userRouter);

router.use('/workspaces', workspaceRouter);

router.use('/channels', useChannel);

router.use('/members', memberRouter);

router.use('/messages', messageRouter);

router.use('/payments', paymentRouter);

export default router;
