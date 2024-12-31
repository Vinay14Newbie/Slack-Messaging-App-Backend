import { StatusCodes } from 'http-status-codes';

import {
  findAllUsersService,
  signinUserService,
  signupService,
  verifyTokenService
} from '../services/userService.js';
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

export async function findAllUsers(req, res) {
  try {
    const users = await findAllUsersService();
    return res
      .status(StatusCodes.OK)
      .json(successResponse(users, 'Users details fetched successfully'));
  } catch (error) {
    console.log('User controller error: ', error);

    return res.status(StatusCodes.CONFLICT).json(internalErrorResponse(error));
  }
}

export async function signin(req, res) {
  try {
    const response = await signinUserService(req.body);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'User signed in Successfully'));
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

export async function verifyEmailController(req, res) {
  try {
    const response = await verifyTokenService(req.params.token);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Email verified successfully'));
  } catch (error) {
    console.log('verify email controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}
