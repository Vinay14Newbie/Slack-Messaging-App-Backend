import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import ClientError from '../utils/errors/clientError.js';

const isUserPartOfWorkspace = (workspace, userId) => {
  const response = workspace.members.find(
    (member) =>
      member.memberId.toString() === userId ||
      member.memberId._id.toString() === userId
  );
  return response;
};

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);
    console.log('Channel details: ', channel);

    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        explanation: 'Invalid data sent by the user',
        message: "Channel doesn't exist or Workspace don't linked with it",
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserPartOfWorkspace(channel.workspaceId, userId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'Invalid data sent by the user',
        message:
          'User is not part of the workspace, & hence cannot access the channel',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return channel;
  } catch (error) {
    console.log('Get channel by ID service error: ', error);
    throw error;
  }
};
