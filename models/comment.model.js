import mongoose, { model } from "mongoose";
import Blog from "./blog.model.js";
import User from "./user.model.js"

const commentSchema = new mongoose.Schema({
    blog : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blog",
        required : true
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    message : {
        type : String,
        trim : true,
        maxlength : 1000
    }
})

const Comment = model("Comment" , commentSchema);

export default Comment;