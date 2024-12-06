import Workspace from '../schema/workspace.js';
import crudRepository from './crudRepository.js';

const workspaceRepository = {
  ...crudRepository(Workspace),

  getWorkspaceByName: async (name) => {},

  getWorkspaceByJoincode: async (joinCode) => {},

  addMemberToWorkspace: async (member) => {},

  addChannelToWorkspace: async (channel) => {},

  fetchAllWorkspaceByMemberId: async (id) => {}
};
