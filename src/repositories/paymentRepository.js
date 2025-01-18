import Payment from '../schema/payment.js';
import crudRepository from './crudRepository.js';

const paymentRepository = {
  ...crudRepository(Payment),

  updateOrder: async (orderId, data) => {
    const updatedDoc = await Payment.findOneAndUpdate({ orderId }, data, {
      new: true
    });
    return updatedDoc;
  }
};

export default paymentRepository;
