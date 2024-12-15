import { StatusCodes } from 'http-status-codes';
import { getPaginatedMessageService } from '../services/messageService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export const getPaginatedMessageController = async (req, res) => {
  try {
    const messages = await getPaginatedMessageService(
      { channelId: req.params.channelId },
      req.query.page || 1,
      req.query.limit || 20,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Messages fetched successfully :)'));
  } catch (error) {
    console.log('Error while fetching the messages: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
