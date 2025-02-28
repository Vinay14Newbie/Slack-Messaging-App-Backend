import DM from '../schema/DMs.js';
import crudRepository from './crudRepository.js';

const DMRespository = {
  ...crudRepository(DM),

  getPaginatedDMs: async function (DMId, page, limit) {
    const messages = await DM.find(DMId)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId', 'username email avatar')
      .populate('receiverId', 'username email avatar');

    return messages;
  },

  getMessageDetails: async function (messageId) {
    const message = await DM.findById(messageId)
      .populate('senderId', 'username email avatar')
      .populate('receiverId', 'username email avatar');
    return message;
  }
};

export default DMRespository;
