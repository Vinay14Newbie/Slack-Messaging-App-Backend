import { StatusCodes } from 'http-status-codes';

import { getPaginatedDMsService } from '../services/DMService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export const getPaginatedDMMEssagesController = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const DMId = [senderId, receiverId].sort().join('_');
    const messages = await getPaginatedDMsService(
      DMId,
      req.query.page || 1,
      req.query.limit || 20
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, 'DM Messages fetched successfully :)'));
  } catch (error) {
    console.log('Error while fetching the DM messages: ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
