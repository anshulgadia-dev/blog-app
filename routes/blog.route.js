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
import { blogOwnerShipMiddleware } from '../middlewares/blogownership.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validation.middleware.js';
import { createBlogSchema } from '../validations/blog.validation.js';
import { authorize as authorizeUser } from '../middlewares/authorize.middleware.js';

const router = Router();

// public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

router.use(passport.authenticate('jwt', { session: false }));
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
