import express from 'express'
import validate from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';
import { getUserProfile, loginUser, registerUser } from '../controllers/auth.controller.js';
import passport from 'passport';

const router = express.Router();


router.post('/register' , validate(registerSchema) , registerUser);
router.post('/login' , validate(loginSchema) , passport.authenticate("local" , {session : false}) , loginUser)
router.get('/profile' , passport.authenticate("jwt", {session : false}), getUserProfile)


export default router;