import { StatusCodes } from 'http-status-codes';

class validationError extends Error {
  constructor(errorDetails, message) {
    super(message); //call the parent class (i.e, Error) constructor to initialize the message
    this.name = 'validationError';
    let explanation = [];
    Object.keys(errorDetails.error).forEach((key) => {
      explanation.push(errorDetails.error[key]);
    });
    this.explanation = explanation;
    this.message = message;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default validationError;
