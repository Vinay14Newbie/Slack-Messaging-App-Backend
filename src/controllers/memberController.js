import { StatusCodes } from 'http-status-codes';

import { checkIfUserMemberOfWorkspaceService } from '../services/memberService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export async function checkIfUserMemberOfWorkspaceController(req, res) {
  try {
    const response = await checkIfUserMemberOfWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'User is part of workspace :)'));
  } catch (error) {
    console.log(
      'Error while checking if user part of workspace, Controller layer error: ',
      error
    );
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}
