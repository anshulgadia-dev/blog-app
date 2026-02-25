import mongoose, { model } from "mongoose";

const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    content : {
        type : String,
        required : true
    },
    category : {
        type : String,
        default : 'General'
    },
    image : {
        type : String,
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    likedBy : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],   

    likesCount : {
        type : Number,
        default : 0
    }

}, { timestamps : true})


const Blog = model("Blog" , blogSchema);

export default Blog;