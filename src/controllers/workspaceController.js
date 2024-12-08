import { StatusCodes } from 'http-status-codes';

import {
  createWorkspaceService,
  deleteWorkspaceByIdService,
  fetchAllWorkspacesUserIsPartOfService,
  getAllWorkspacesService
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
    return res
      .status(StatusCodes.OK)
      .json(
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
