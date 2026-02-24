import  jwt  from "jsonwebtoken";
import User from "../models/user.model.js";
import { status } from "http-status";

export const registerUser = async (req, res) => {
  try {
    const {name , email , password } = req.body;

    if (await User.isEmailTaken(email)) {
      return res.status(status.CONFLICT).json({
        success: false,
        message: "Email is already taken",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    user.password = undefined;
    const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn : "7d"});
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(status.CREATED).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Error in creating user:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};


export const loginUser = async (req,res) => {
    try {
        const user = req.user;
        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET, {expiresIn : "7d"});
        res.cookie("accessToken" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "strict",
            maxAge : 7 * 24 * 60 * 60 * 100
        })
        return res.status(status.OK).json({success : true , message : "Login Succesful" , user})
    } catch (error) {
        console.log("Error in Login Controller " , error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Internal Server Error",
        })
    }
}


export const getUserProfile = (req, res) => {
    try {
        return res.status(status.OK).json({
            success : true,
            user : req.user
        })
    } catch (error) {
        console.log("Internal Server Error " , error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({success : false , message : "Server Error"})
    }
}