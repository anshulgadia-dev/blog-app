import Blog from "../models/blog.model.js";
import {status} from 'http-status'



export const createBlog = async (req, res) => {
    try {
        const {title , content, category} = req.body;
        
        const blog = await Blog.create({
            title,
            content,
            category,
            author : req.user._id,
        });

        return res.status(status.CREATED).json({success : true , message : "Blog Created" , blog});
    } catch (error) {
        console.error("Error in Create Blog ", error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({success : false, message : "Server Error"})
    }
}

export const deleteBlog = async (req,res) => {
    try {
        const blog = req.blog;
        await blog.deleteOne();
        return res.status(status.OK).json({success : true, message : "Blog Deleted Successfully"});
        
    } catch (error) {
        console.log("Error in deleting blog ", error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({success : false, message : "Server Error"})
    }
}

export const updateBlog = async (req, res) => {
  try {
    const blog = req.blog;
    const { title, content, category } = req.body;

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category;

    await blog.save();

    return res.status(status.OK).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.log("Error in updating blog", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const blogs = await Blog.find({})


    return res.status(status.OK).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log("Get All Blogs Error ", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(status.OK).json({ success: true, blog });
  } catch (error) {
    console.log("Get Blog Error ", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server Error",
    });
  }
};