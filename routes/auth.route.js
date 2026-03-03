import { Router } from 'express';
import passport from 'passport';

import {
  getUserProfile,
  loginUser,
  registerUser,
} from '../controllers/auth.controller.js';
import validate from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';

const router = Router();
router.post('/register', validate(registerSchema), registerUser);
router.post(
  '/login',
  validate(loginSchema),
  passport.authenticate('local', { session: false }),
  loginUser,
);
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getUserProfile,
);

export default router;
