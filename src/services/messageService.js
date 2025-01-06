import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserPartOfWorkspace } from './memberService.js';

export const getPaginatedMessageService = async (
  messageParams,
  page,
  limit,
  userId
) => {
  const channelDetails = await channelRepository.getChannelWithWorkspaceDetails(
    messageParams.channelId
  );

  const workspace = channelDetails.workspaceId;

  const isMember = isUserPartOfWorkspace(workspace, userId);
  if (!isMember) {
    throw new ClientError({
      explanation: 'Invalid data sent',
      message: 'User is not a member of the workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }

  const messages = await messageRepository.getPaginatedMessage(
    messageParams,
    page,
    limit
  );
  return messages;
};

export const createMessageService = async (message) => {
  const newMessage = await messageRepository.create(message);

  const messageDetails = await messageRepository.getMessageDetails(
    newMessage._id
  );

  return messageDetails;
};
