import DMRespository from '../repositories/DMRespository.js';

export const getPaginatedDMsService = async function (DMId, page, limit) {
  const messages = await DMRespository.getPaginatedDMs(DMId, page, limit);
  return messages;
};

export const createDMMessageService = async function (message) {
  const newDMMessage = await DMRespository.create(message);

  const messageDetails = await DMRespository.getMessageDetails(
    newDMMessage._id
  );
  return messageDetails;
};
