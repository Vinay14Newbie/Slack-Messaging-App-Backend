import { StatusCodes } from 'http-status-codes';
import Workspace from '../schema/workspace.js';
import crudRepository from './crudRepository.js';
import ClientError from '../utils/errors/clientError.js';
import User from '../schema/user.js';
import channelRepository from './channelRepository.js';

const workspaceRepository = {
  ...crudRepository(Workspace),

  getWorkspaceByName: async (name) => {
    const workspace = await Workspace.findOne({ name });

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent by the user',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return workspace;
  },

  getWorkspaceByJoincode: async (joinCode) => {
    const workspace = await Workspace.findOne({ joinCode });

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent by the user',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return workspace;
  },

  addMemberToWorkspace: async (workspaceId, memberId, role) => {
    const workspace = await Workspace.findById(workspaceId);
    console.log('Workspace in repo layer: ', workspace);

    if (!workspace) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    console.log('Member id in repo layer: ', memberId);

    const isValidUser = await User.findById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMemberAlreadyPartOfWorkspace = workspace.members.find(
      (member) => member.memberId == memberId
    );

    if (isMemberAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'User is already part of the workspace',
        statusCode: StatusCodes.FORBIDDEN // this operation is not allowed
      });
    }

    workspace.members.push({ memberId, role });

    await workspace.save();

    return workspace;
  },

  addChannelToWorkspace: async (workspaceId, channelName) => {
    const workspace =
      await Workspace.findById(workspaceId).populate('channels');
    if (!workspace) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name === channelName
    );

    if (isChannelAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: 'invalid data sent by the user',
        message: 'Channel is already part of the workspace',
        statusCode: StatusCodes.FORBIDDEN // this operation is not allowed
      });
    }

    const channel = await channelRepository.create({ name: channelName });

    workspace.channels.push(channel);
    await workspace.save();

    return workspace;
  },

  // fetch all the Workspaces where this memberId lies
  fetchAllWorkspaceByMemberId: async (memberId) => {
    const workspaces = await Workspace.find({
      'members.memberId': memberId //if we found the same ID it will stored in the workspaces
    }).populate('members.memberId', 'username email avatar');

    return workspaces;
  }
};

export default workspaceRepository;
