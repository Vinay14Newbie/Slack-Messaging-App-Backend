import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { addEmailtoMailQueue } from '../producers/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import { workspaceJoinMail } from '../utils/common/mailObject.js';
import ClientError from '../utils/errors/clientError.js';
import validationError from '../utils/errors/validationError.js';

export const createWorkspaceService = async (worksapceData) => {
  try {
    // joinCode is required for every workspace
    const joinCode = uuidv4().substring(0, 6).toUpperCase();

    const newWorkspace = await workspaceRepository.create({
      name: worksapceData.name,
      description: worksapceData.description,
      joinCode
    });

    // the person who created the workspace is admin
    await workspaceRepository.addMemberToWorkspace(
      newWorkspace._id.toString(),
      worksapceData.owner,
      'admin'
    );

    // add channel to the workspace
    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      newWorkspace._id,
      'general'
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('Workspace service layer error: ', error);
    if (error.name === 'validationError') {
      throw new validationError(
        {
          error: error.errors
        },
        error.message
      );
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new validationError(
        {
          error: ['A workspace with same details already exists']
        },
        'A workspace with same details already exists'
      );
    }
    throw error;
  }
};

export const getAllWorkspacesService = async () => {
  const workspaces = await workspaceRepository.getAll();
  return workspaces;
};

export const getWorkspaceByNameService = async (workspaceName) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByName(workspaceName);
    return workspace;
  } catch (error) {
    console.log('found error in service layer');

    throw error;
  }
};

export const deleteWorkspaceByIdService = async (workspaceId, userId) => {
  try {
    // 1- check if the workspace exist
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'Workspace not found with this id',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 2- if the user is admin then delete the workspace
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);

    if (isAllowed) {
      // All channel document who have the same _id as in the workspace.channels array have, will get deleted
      await channelRepository.deleteMany(workspace.channels);

      const response = workspaceRepository.delete(workspaceId);
      return response;
    }

    throw new ClientError({
      explanation:
        'userRepository getById either not a memeber or an admin of the workspace',
      message: 'userRepository getById not allowed to delete the workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log('found error in service layer');
    throw error;
  }
};

export const fetchAllWorkspacesUserIsPartOfService = async (memberId) => {
  try {
    const workspaces =
      await workspaceRepository.fetchAllWorkspaceByMemberId(memberId);
    return workspaces;
  } catch (error) {
    console.log(
      'Error in service layer while fetching the workspaces: ',
      error
    );
    throw error;
  }
};

const isUserPartOfWorkspace = (workspace, userId) => {
  const response = workspace.members.find(
    (member) =>
      member.memberId.toString() === userId ||
      member.memberId._id.toString() === userId
  );
  return response;
};

export const isUserAdminOfWorkspace = (workspace, userId) => {
  // const response = workspace.members.find(
  //   (member) =>
  //     member.memberId._id.toString() === userId && member.role === 'admin'
  // );
  // console.log('response ', response);

  const response = workspace.members.find(
    (member) =>
      (member.memberId.toString() === userId ||
        member.memberId._id.toString() === userId) &&
      member.role === 'admin'
  );
  return response;
};

export const isChannelPartOfWorkspace = (workspace, channelId) => {
  return workspace.channels.find(
    (channel) => channel._id.toString() === channelId
  );
};

const isUserMemberOfWorkspace = (workspace, userId) => {
  const response = workspace.members.find(
    (member) =>
      member.memberId.toString() === userId ||
      member.memberId._id.toString() === userId
  );
  return response;
};

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  const response = workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
  );
  return response;
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    // 1- check if workspace exist
    const workspace = await workspaceRepository.getWorkspaceById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent by user',
        message: "Workspace doesn't exist",
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 2- check if user part of this workspace
    const isMember = isUserPartOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explanation: 'Invalid data sent by user',
        message: 'User not present in given workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return workspace;
  } catch (error) {
    console.log('Service layer error: ', error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoincode(joinCode);
    if (!workspace) {
      throw new ClientError({
        explanation: 'invalid data sent by user',
        message: 'Join code is invalid',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    console.log('Workspace: ', workspace);

    // check if user member of workspace or not
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'Invalid data sent by user',
        message: 'User is not part of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log('get workspace by joincode service error', error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    // 1- check if workspace exist
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid workspace id provided',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 2- check if user is valid or not
    const isValidUser = await userRepository.getById(userId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 3- check if user is admin or not
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'User is not admin',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return updatedWorkspace;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetJoinCodeOfWorkspaceService = async (workspaceId, userId) => {
  try {
    const newJoinCode = uuidv4().substring(0, 6).toUpperCase();
    const response = await updateWorkspaceService(
      workspaceId,
      { joinCode: newJoinCode },
      userId
    );
    return response;
  } catch (error) {
    'Error in udpate joinCode service layer', error;
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  try {
    // 1- check workspace
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid workspaced ID sent by user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 2- check if user exist
    const isValidUser = await userRepository.getById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 3- check if user is admin or not
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'User is not a admin, he do not have authority to add members',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    // 4- check if member is already part of workspace or not
    const isMember = isUserMemberOfWorkspace(workspace, memberId);
    if (isMember) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'User is already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );

    addEmailtoMailQueue({
      ...workspaceJoinMail(workspace.name),
      to: isValidUser.email
    });

    return response;
  } catch (error) {
    console.log('Error found while adding member to a workspace: ', error);
    throw error;
  }
};

export const addMemberToWorksapceByEmailService = async (
  workspaceId,
  memberEmail,
  role,
  userId
) => {
  try {
    // 1- check workspace
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid workspaced ID sent by user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 2- check if user exist
    const isValidUser = await userRepository.getByEmail(memberEmail);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const memberId = isValidUser._id;

    // 3- check if user is admin or not
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'User is not a admin, he do not have authority to add members',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    // 4- check if member is already part of workspace or not
    // first convert the memberId to string
    const isMember = isUserMemberOfWorkspace(workspace, memberId.toString());
    if (isMember) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'User is already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );

    addEmailtoMailQueue({
      ...workspaceJoinMail(workspace.name),
      to: isValidUser.email
    });

    return response;
  } catch (error) {
    console.log(
      'Error found while adding member by id, in a workspace: ',
      error
    );
    throw error;
  }
};

export const removeMemberFromWorkspaceByEmailService = async (
  workspaceId,
  memberEmail,
  userId
) => {
  // 1- check workspace
  const workspace = await workspaceRepository.getById(workspaceId);

  if (!workspace) {
    throw new ClientError({
      explanation: 'Invalid data',
      message: 'Invalid workspaced ID sent by user',
      statusCode: StatusCodes.NOT_FOUND
    });
  }

  // 2- check if user exist
  const isValidUser = await userRepository.getByEmail(memberEmail);
  if (!isValidUser) {
    throw new ClientError({
      explanation: 'invalid data sent by the user',
      message: 'User not found',
      statusCode: StatusCodes.NOT_FOUND
    });
  }

  const memberId = isValidUser._id;

  // 3- check if user is admin or not
  const isAdmin = isUserAdminOfWorkspace(workspace, userId);
  if (!isAdmin) {
    throw new ClientError({
      explanation: 'Invalid data',
      message: 'User is not a admin, he do not have authority to add members',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }

  // 4- check if member is part of workspace or not
  // first convert the memberId to string
  const isMember = isUserMemberOfWorkspace(workspace, memberId.toString());
  if (!isMember) {
    throw new ClientError({
      explanation: 'invalid data',
      message: 'Member you are trying to remove is not a part of workspace',
      statusCode: StatusCodes.FORBIDDEN
    });
  }

  const response = await workspaceRepository.remvoveMemberFromWorkspace(
    workspaceId,
    memberId
  );

  return response;
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    // 1- check if workspace exist
    // here we're populating the details so workspace.members.memberId will have the full details
    // for getting id we need to do workspace.members.memberId._id
    const workspace = await workspaceRepository.workspaceDetails(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid workspaced ID sent by user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 2- check if user is admin or not
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'user is not admin',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    // 3- check if channel already part of workspace
    const isChannelAlreadyExistinWorkspace = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );
    if (isChannelAlreadyExistinWorkspace) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'Channel is already part of the workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    console.log(
      'Error while adding channel to the workspace in service layer: ',
      error
    );
    throw error;
  }
};

export const joinWorkspaceByJoinCodeService = async (
  workspaceId,
  joinCode,
  userId
) => {
  try {
    const workspace = await workspaceRepository.workspaceDetails(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid workspaced ID sent by user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (isMember) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'User is already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    if (workspace.joinCode !== joinCode) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid joinCode provided',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      userId,
      'member'
    );
    return updatedWorkspace;
  } catch (error) {
    console.log('Error in service layer, joinWorkspaceByJoinCode: ', error);
    throw error;
  }
};

export const updateChannelByIdService = async (
  channelId,
  workspaceId,
  userId,
  name
) => {
  try {
    // 1- check if workspace exist
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid workspace id provided',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 2- check if channelId is valid or not
    const channel = await channelRepository.getById(channelId);
    if (!channel) {
      throw new ClientError({
        explanation: 'Invalid data',
        message: 'Invalid channel id provided',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 3- check if channel is part of workspace or not
    const checkChannelPartOfWorkspace = isChannelPartOfWorkspace(
      workspace,
      channelId
    );
    if (!checkChannelPartOfWorkspace) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'Channel is not part of workspace',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 4- check if user exist or not
    const validUser = await userRepository.getById(userId);
    if (!validUser) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // 5- check if user is admin or not
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'invalid data',
        message: 'User is not admin',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const updatedChannel = await channelRepository.update(channelId, name);

    return updatedChannel;
  } catch (error) {
    console.log('Service error, while updating the channel: ', error);
    throw error;
  }
};
