import status from "http-status";
import Blog from "../models/blog.model.js";

export const blogOwnerShipMiddleware = async (req,res,next) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(status.NOT_FOUND).json({success : false , message : "Blog not found"})
        }

        if(!blog.author.equals(req.user._id)){
            return res.status(status.FORBIDDEN).json({success : false , message : "You are not the owner of this blog"});
        }

        req.blog = blog;
        next();

    } catch (error) {
        console.log("Ownership middleware error ", error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({success : false , message : "Server Error"});
    }
}