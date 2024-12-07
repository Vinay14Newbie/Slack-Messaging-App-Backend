import { v4 as uuidv4 } from 'uuid';

import workspaceRepository from '../repositories/workspaceRepository.js';
import { customErrorResponse } from '../utils/common/responseObject.js';
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

    console.log('new Workspace: ', newWorkspace);
    console.log(`new workspaces's id: ${newWorkspace._id.toString()}`);

    // the person who created the workspace is admin
    await workspaceRepository.addMemberToWorkspace(
      newWorkspace._id.toString(),
      worksapceData.owner,
      'admin'
    );

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

export const getWorkspaceByIdService = async (workspaceId) => {
  const workspace = await workspaceRepository.getById(workspaceId);
  if (!workspace) {
    throw customErrorResponse({
      explanation: 'Invalid id received',
      message: 'workspace with this id does not exist'
    });
  }
  return workspace;
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

export const deleteWorkspaceByIdService = async (workspaceId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    console.log('workspace: ', workspace);

    if (!workspace) {
      throw customErrorResponse({
        explanation: 'invalid data',
        message: 'id is not valid'
      });
    }

    const response = await workspaceRepository.delete(workspaceId);
    return response;
  } catch (error) {
    console.log('found error in service layer');
    throw error;
  }
};
