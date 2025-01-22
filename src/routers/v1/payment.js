import express from 'express';

import {
  capturePaymentController,
  createOrderController
} from '../../controllers/paymentController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const paymentRouter = express.Router();

paymentRouter.post('/order', isAuthenticated, createOrderController);

paymentRouter.post('/capture', capturePaymentController);

export default paymentRouter;
