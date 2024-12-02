import userRepository from '../repositories/userRepository.js';

export const signupService = async (data) => {
  try {
    const newUser = await userRepository.create(data);
    return newUser;
  } catch (error) {
    if (error.code === 11000 && error.name === 'MongoServerError') {
      throw {
        status: 400, //bad request
        message: 'user with the same username or email address already exists'
      };
    }
    throw error;
  }
};
