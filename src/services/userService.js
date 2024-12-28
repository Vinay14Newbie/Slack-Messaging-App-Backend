import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/userRepository.js';
import { createJwt } from '../utils/common/authUtils.js';
import ClientError from '../utils/errors/clientError.js';
import validationError from '../utils/errors/validationError.js';

export const signupService = async (data) => {
  try {
    const newUser = await userRepository.create(data);
    return newUser;
  } catch (error) {
    console.log('User service error: ', error);
    console.log('user service error.name: ', error.name);

    if (error.name == 'validationError') {
      throw new validationError(
        {
          error: error.errors
        },
        error.message
      );
    }

    if (error.name == 'MongoServerError' && error.code == 11000) {
      throw new validationError(
        {
          error: ['A user with same email or username already exists']
        },
        'A user with same email or username already exists'
      );
    }
  }
};

export const findAllUsersService = async () => {
  const users = await userRepository.getAll();
  return users;
};

export const signinUserService = async (data) => {
  try {
    const email = data.email;
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new ClientError({
        explanation: 'Invalid data sent by user',
        message: 'No registered user found with this email',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isPasswordValid = bcrypt.compareSync(data.password, user.password);

    if (!isPasswordValid) {
      throw new ClientError({
        explanation: 'Invalid data sent by user',
        message: 'Password is invalid, Please try later',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    return {
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      id: user._id,
      token: createJwt({ id: user._id, email: user.email })
    };
  } catch (error) {
    console.log('Found error in service layer: ', error);
    throw error;
  }
};
