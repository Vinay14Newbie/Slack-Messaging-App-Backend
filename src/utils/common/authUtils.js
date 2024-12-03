import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/serverConfig.js';

export const createJwt = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};
