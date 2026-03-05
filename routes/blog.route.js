import { Router } from 'express';
import passport from 'passport';

import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  toggleLike,
  addComment,
  removeComment,
  updateComment,
} from '../controllers/blog.controller.js';
import { authorize as authorizeUser } from '../middlewares/authorize.middleware.js';
import { blogOwnerShipMiddleware } from '../middlewares/blogownership.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validation.middleware.js';
import { createBlogSchema } from '../validations/blog.validation.js';

const router = Router();

// public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

router.use((req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Authenticatin Failed',
      });
    }
    req.user = user;
    next();
  })(req, res, next);
});
router.post(
  '/',
  upload.single('blogImage'),
  authorizeUser('user'),
  validate(createBlogSchema),
  createBlog,
);
router.delete('/:id', blogOwnerShipMiddleware, deleteBlog);

router.post('/like/:id', toggleLike);

router.post('/comment/:id', addComment);
router.delete('/comment/:id', removeComment);
router.put('/comment/:id', updateComment);

export default router;
