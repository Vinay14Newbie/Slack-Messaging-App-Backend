import { StatusCodes } from 'http-status-codes';

import { signupService } from '../services/userService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export async function signup(req, res) {
  try {
    const user = await signupService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(user, 'user created successfully'));
  } catch (error) {
    console.log('User controller error: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}
