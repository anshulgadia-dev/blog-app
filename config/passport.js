import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local'
import { Strategy as JWTStrategy } from "passport-jwt";
import User from "../models/user.model.js";


passport.use(new LocalStrategy(
    {
        usernameField : "email",
        passwordField : "password"
    },
    async (email,password,done) => {
        try {
            const user = await User.findOne({email}).select("+password");
            if(!user){
                return done(null,false,{message : "Invalid Email or Password"});
            }
            const isMatch = await user.comparePassword(password);
            if(!isMatch){
                return done(null,false,{message : "Invalid email or password"});
            }
            user.password = undefined;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
))



const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies.accessToken;
  }
  return null;
};

passport.use(new JWTStrategy(
    {
        jwtFromRequest : cookieExtractor,
        secretOrKey : process.env.JWT_SECRET || "blog-app",
    }, 
    async (payload, done) => {
        try {
            const user = await User.findById(payload.id).select("-password");
            if(!user) return done(null,false);
            return done(null,user);
        } catch (error) {
            return done(error,false);
        }
}));


export default passport;