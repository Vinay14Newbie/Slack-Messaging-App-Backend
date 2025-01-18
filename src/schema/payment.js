import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    paymentId: {
      type: String
    },
    status: {
      type: String,
      required: true,
      enum: ['created', 'success', 'failed'],
      default: 'created'
    },
    amount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
