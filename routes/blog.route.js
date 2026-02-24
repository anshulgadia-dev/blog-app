import express from 'express'
import passport from 'passport';
import { createBlog, deleteBlog, getAllBlogs , getBlogById} from '../controllers/blog.controller.js';
import {blogOwnerShipMiddleware} from '../middlewares/blogownership.middleware.js'

const router = express.Router();

router.post('/' , passport.authenticate("jwt" , {session : false}) ,createBlog);
router.delete('/:id' , passport.authenticate("jwt" , {session : false}),blogOwnerShipMiddleware, deleteBlog);
router.get('/' , getAllBlogs);
router.get('/:id' , getBlogById);

export default router;