import { StatusCodes } from 'http-status-codes';

import razorpay from '../config/razorpayConfig.js';
import { CURRENCY, RECEIPT_SECRET } from '../config/serverConfig.js';
import {
  createPaymentService,
  updatePaymentStatusService
} from '../services/paymentService.js';
import {
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export async function createOrderController(req, res) {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: CURRENCY,
      receipt: RECEIPT_SECRET
    };
    const order = await razorpay.orders.create(options);
    console.log('order: ', order);

    if (!order) {
      throw new Error('Failed to create order');
    }

    await createPaymentService(order.id, order.amount);

    return res.status(StatusCodes.CREATED).json(
      successResponse({
        success: true,
        message: 'Order created successfully',
        data: order
      })
    );
  } catch (error) {
    console.log('Error in createOrderController: ', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function capturePaymentController(req, res) {
  try {
    console.log('Request body, capturePaymentController: ', req.body);

    const response = await updatePaymentStatusService(
      req.body.orderId,
      req.body.status,
      req.body.paymentId,
      req.body.signature
    );
    return res.status(StatusCodes.OK).json(
      successResponse({
        success: true,
        message: 'Payment captured successfully',
        data: response
      })
    );
  } catch (error) {
    console.log('Error in capturePaymentController: ', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}
