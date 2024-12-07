import { StatusCodes } from 'http-status-codes';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';
import {
  createWorkspaceService,
  deleteWorkspaceByIdService,
  getAllWorkspacesService
} from '../services/workspaceService.js';

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

export async function findAllWorkspaces(req, res) {
  try {
    const users = await getAllWorkspacesService();
    return res
      .status(StatusCodes.OK)
      .json(successResponse(users, 'Users details fetched successfully'));
  } catch (error) {
    console.log('User controller error: ', error);

    return res.status(StatusCodes.CONFLICT).json(internalErrorResponse(error));
  }
}

export async function deleteWorkspaceById(req, res) {
  try {
    console.log('id from user: ', req.body.id);

    const response = await deleteWorkspaceByIdService(req.body.id);
    if (!response) {
      return res.status(StatusCodes.NOT_FOUND).json(
        customErrorResponse({
          message: 'workspace not found'
        })
      );
    }
    return res
      .status(StatusCodes.OK)
      .json(successResponse({ message: 'workspace deleted successfully' }));
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
