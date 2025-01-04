import { StatusCodes } from 'http-status-codes';

import {
  addChannelToWorkspaceService,
  addMemberToWorksapceByEmailService,
  addMemberToWorkspaceService,
  createWorkspaceService,
  deleteWorkspaceByIdService,
  fetchAllWorkspacesUserIsPartOfService,
  getAllWorkspacesService,
  getWorkspaceByJoinCodeService,
  getWorkspaceService,
  joinWorkspaceByJoinCodeService,
  removeMemberFromWorkspaceByEmailService,
  resetJoinCodeOfWorkspaceService,
  updateChannelByIdService,
  updateWorkspaceService
} from '../services/workspaceService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export async function createWorkspaceController(req, res) {
  try {
    const response = await createWorkspaceService({
      ...req.body,
      owner: req.user //we have already added 'user' property while authentication via jwt token
    });
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(response, 'Workspace created successfully'));
  } catch (error) {
    console.log('Workspace controller error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function findAllWorkspacesController(req, res) {
  try {
    const users = await getAllWorkspacesService();
    return res
      .status(StatusCodes.OK)
      .json(successResponse(users, 'Users details fetched successfully'));
  } catch (error) {
    console.log('User controller error: ', error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function deleteWorkspaceByIdController(req, res) {
  try {
    console.log('id from user: ', req.params.workspaceId);

    const response = await deleteWorkspaceByIdService(
      req.params.workspaceId,
      req.user
    );
    if (!response) {
      return res.status(StatusCodes.NOT_FOUND).json(
        customErrorResponse({
          message: 'workspace not found'
        })
      );
    }
    return res.status(StatusCodes.OK).json(
      successResponse({
        message: 'workspace deleted successfully',
        data: response
      })
    );
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function fetchAllWorkspaceUserIsPartOfController(req, res) {
  try {
    const workspaces = await fetchAllWorkspacesUserIsPartOfService(req.user);
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(
          workspaces,
          'Workspaces where memberId belongs has been fetched :/'
        )
      );
  } catch (error) {
    console.log('workspace controller error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function getWorkspaceByIdController(req, res) {
  try {
    const workspace = await getWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(workspace, 'fetched workspace succesfully'));
  } catch (error) {
    console.log('Controller layer error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function getWorkspaceByJoinCodeController(req, res) {
  try {
    const workspace = await getWorkspaceByJoinCodeService(
      req.params.joinCode,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(workspace, 'fetched workspace succesfully'));
  } catch (error) {
    console.log('Controller layer error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function updateWorkspaceController(req, res) {
  try {
    const response = await updateWorkspaceService(
      req.params.workspaceId,
      req.body,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Workspace updated succesfully'));
  } catch (error) {
    console.log('Controller layer error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function addMemberToWorkspaceController(req, res) {
  try {
    const response = await addMemberToWorkspaceService(
      req.params.workspaceId,
      req.body.memberId,
      req.body.role || 'member',
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Member added successfully :)'));
  } catch (error) {
    console.log('Controller layer error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function addChannelToWorkspaceController(req, res) {
  try {
    const response = await addChannelToWorkspaceService(
      req.params.workspaceId,
      req.body.channelName,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Channel created successfully :)'));
  } catch (error) {
    console.log('Controller layer error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function addMemberToWorksapceByEmailController(req, res) {
  try {
    const response = await addMemberToWorksapceByEmailService(
      req.params.workspaceId,
      req.body.memberEmail,
      req.body.role || 'member',
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Member added successfully :)'));
  } catch (error) {
    console.log('Controller layer error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function removeMemberFromWorkspaceByEmailController(req, res) {
  try {
    const response = await removeMemberFromWorkspaceByEmailService(
      req.params.workspaceId,
      req.body.memberEmail,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Member removed successfully :)'));
  } catch (error) {
    console.log('Controller layer error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function resetJoinCodeOfWorkspaceController(req, res) {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user;
    const response = await resetJoinCodeOfWorkspaceService(workspaceId, userId);

    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(
          response,
          'Join code of workspace successfully reseted :)'
        )
      );
  } catch (error) {
    console.log('Controller layer error in reset Join code: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function joinWorkspaceByJoinCodeController(req, res) {
  try {
    const response = await joinWorkspaceByJoinCodeService(
      req.params.workspaceId,
      req.body.joinCode,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Joined workspace successfully'));
  } catch (error) {
    console.log('Controller layer error in join by code: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}

export async function updateChannelByIdController(req, res) {
  try {
    const response = await updateChannelByIdService(
      req.params.channelId,
      req.params.workspaceId,
      req.user,
      req.body
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Channel data updated successfully'));
  } catch (error) {
    console.log('Controller layer error, updating channel: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}
