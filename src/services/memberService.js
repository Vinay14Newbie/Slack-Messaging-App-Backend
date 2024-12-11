import { StatusCodes } from 'http-status-codes';
import workspaceRepository from '../repositories/workspaceRepository.js';
import ClientError from '../utils/errors/clientError.js';

const isUserPartOfWorkspace = function (workspace, userId) {
  const response = workspace.members.find(
    (member) =>
      member.memberId.toString() === userId ||
      member.memberId._id.toString() === userId
  );
  return response;
};

export const checkIfUserMemberOfWorkspaceService = async (
  workspaceId,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid workspaced ID sent by user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserPartOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'User is not part of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return isMember;
  } catch (error) {
    console.log(
      'Error while checking if user is part of workspace or not in service layer: ',
      error
    );
    throw error;
  }
};
