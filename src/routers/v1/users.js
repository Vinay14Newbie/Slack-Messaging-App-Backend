import express from 'express';
import { zodSignupSchema } from '../../validators/zodSignupSchema.js';
import { validate } from '../../validators/zodValidator.js';
import { signup } from '../../controllers/userController.js';

const router = express.Router();

router.post('/signup', validate(zodSignupSchema), signup);

export default router;
