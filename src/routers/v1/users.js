import express from 'express';

import {
  findAllUsers,
  signin,
  signup
} from '../../controllers/userController.js';
import {
  zodSigninSchema,
  zodSignupSchema
} from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/signup', validate(zodSignupSchema), signup);

router.post('/signin', validate(zodSigninSchema), signin);

router.get('/', findAllUsers);

export default router;
