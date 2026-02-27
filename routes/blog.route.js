import express from 'express'
import passport from 'passport';
import { createBlog, deleteBlog, getAllBlogs , getBlogById , toggleLike , addComment, removeComment, updateComment} from '../controllers/blog.controller.js';
import {blogOwnerShipMiddleware} from '../middlewares/blogownership.middleware.js'
import upload from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validation.middleware.js';
import { createBlogSchema } from '../validations/blog.validation.js';

const router = express.Router();

router.post('/' , passport.authenticate("jwt" , {session : false}) , upload.single("blogImage") ,validate(createBlogSchema) , createBlog);
router.delete('/:id' , passport.authenticate("jwt" , {session : false}),blogOwnerShipMiddleware, deleteBlog);
router.get('/' , getAllBlogs);
router.get('/:id' , getBlogById);


router.post('/like/:id' , passport.authenticate("jwt" , {session : false}) , toggleLike)
// router.post('/dislike/:id' , passport.authenticate("jwt" , {session : false}) , disLike)


router.post('/comment/:id' , passport.authenticate("jwt" , {session : false}) , addComment);
router.delete('/comment/:id' , passport.authenticate("jwt" , {session : false}) , removeComment);
router.put('/comment/:id' , passport.authenticate("jwt" , {session : false}) , updateComment);



export default router;