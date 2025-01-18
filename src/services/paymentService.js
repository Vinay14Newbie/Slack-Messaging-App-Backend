import crypto from 'crypto';

import { RAZORPAY_KEY_SECRET } from '../config/serverConfig.js';
import paymentRepository from '../repositories/paymentRepository.js';

export const createPaymentService = async (orderId, amount) => {
  try {
    const payment = await paymentRepository.create({ orderId, amount });
    return payment;
  } catch (error) {
    console.log('Error while making payment');
    throw error;
  }
};

export const updatePaymentStatusService = async (
  orderId,
  status,
  paymentId,
  signature
) => {
  // 1--verify if payment is success or not

  if (status === 'success') {
    const sharesponse = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    console.log('sharesponse', sharesponse, signature);

    if (sharesponse === signature) {
      const payment = await paymentRepository.updateOrder(orderId, {
        status: 'success',
        paymentId
      });
      return payment;
    } else {
      throw new Error('Payment verification failed');
    }
  }
};
