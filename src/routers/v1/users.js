import express from 'express';

import { signup } from '../../controllers/userController.js';
import { zodSignupSchema } from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/signup', validate(zodSignupSchema), signup);

export default router;
