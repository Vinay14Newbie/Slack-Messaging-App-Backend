import { StatusCodes } from 'http-status-codes';
import { customErrorResponse } from '../utils/common/responseObject.js';

export const validate = (schema) => {
  // schema- what are the excepted input properties for this particular schema bodyy
  return async (req, res, next) => {
    try {
      console.log(req.body);

      await schema.parseAsync(req.body); //schema object is created by zod
      // parse() it will check whether the incoming the js object is validating schema or not
      next();
    } catch (error) {
      console.log('Validation error in zod validator: ', error.message);

      let explanation = [];
      let errorMessage = '';
      error.errors.forEach((key) => {
        explanation.push(key.path[0] + ' ' + key.message);
        errorMessage += ` : ` + key.path[0] + ' ' + key.message;
      });

      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Validation error' + errorMessage,
          explanation: explanation
        })
      );
    }
  };
};
