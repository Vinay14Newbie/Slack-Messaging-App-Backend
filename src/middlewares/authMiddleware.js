import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import {
  customErrorResponse,
  internalErrorResponse
} from '../utils/common/responseObject.js';
import { JWT_SECRET } from '../config/serverConfig.js';
import userRepository from '../repositories/userRepository.js';

export const isAuthenticated = async function (req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).json(
      customErrorResponse({
        explanation: 'Invalid data sent by the user',
        message: 'No auth token provided'
      })
    );
  }
  try {
    const response = jwt.verify(token, JWT_SECRET);
    if (!response) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent by the user',
          message: 'Invalid auth token provided'
        })
      );
    }
    console.log('user return via token: ', response);

    const user = await userRepository.getById(response.id);
    req.user = user;
    next();
  } catch (error) {
    console.log('AuthMiddleware error: ', error);
    if (error.name == 'JsonWebTokenError') {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent by the client',
          message: 'Invalid auth token provided'
        })
      );
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
