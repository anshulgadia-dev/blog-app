import { Router } from 'express';
import passport from 'passport';

import {
  getUserProfile,
  loginUser,
  registerUser,
  logoutUser,
} from '../controllers/auth.controller.js';
import validate from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';

const router = Router();
router.post('/register', validate(registerSchema), registerUser);
router.post(
  '/login',
  validate(loginSchema),
  (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info.message || 'Authentication failed',
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  loginUser,
);
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getUserProfile,
);
router.post('/logout', logoutUser);

export default router;
