import messageRepository from '../repositories/messageRepository.js';

export const getPaginatedMessageService = async (
  messageParams,
  page,
  limit
) => {
  const messages = await messageRepository.getPaginatedMessage(
    messageParams,
    page,
    limit
  );
  return messages;
};
