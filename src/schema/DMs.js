import mongoose from 'mongoose';

const DMSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Messaage body is required']
    },
    image: {
      type: String
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver Id is required']
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender Id is required']
    },
    dmId: {
      type: String,
      required: [true, 'DM id is required']
    }
  },
  { timestamps: true }
);

const DM = mongoose.model('DM', DMSchema);

export default DM;
