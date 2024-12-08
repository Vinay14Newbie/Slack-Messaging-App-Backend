import { StatusCodes } from 'http-status-codes';

import Workspace from '../schema/workspace.js';
import ClientError from '../utils/errors/clientError.js';
import channelRepository from './channelRepository.js';
import crudRepository from './crudRepository.js';

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

    // finally add member to the workspace
    workspace.members.push({ memberId, role });

    await workspace.save();

    return workspace;
  },

  addChannelToWorkspace: async (workspaceId, channelName) => {
    const workspace = await Workspace.findById(workspaceId);

    console.log(
      'Workspace in repo layer: ',
      workspace,
      ' & channelName in repo layer: ',
      channelName
    );

    const channel = await channelRepository.create({
      name: channelName,
      workspaceId: workspaceId
    });

    console.log('Channel in repo layer: ', channel);

    workspace.channels.push(channel);
    await workspace.save();

    return workspace;
  },

  // fetch all the Workspaces where this memberId lies
  fetchAllWorkspaceByMemberId: async (memberId) => {
    const workspaces = await Workspace.find({
      'members.memberId': memberId //if we found the same ID it will stored in the workspaces
    })
      .populate('members.memberId', 'username email avatar')
      .populate('channels');

    return workspaces;
  },

  workspaceDetails: async (workspaceId) => {
    const workspaceData = await Workspace.findById(workspaceId)
      .populate('members.memberId', 'username email avatar')
      .populate('channels');
    return workspaceData;
  }
};

export default workspaceRepository;
