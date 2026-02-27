import Blog from "../models/blog.model.js";
import {status} from 'http-status'
import Comment from "../models/comment.model.js";
import redisClient from '../config/redis.js'


export const createBlog = async (req, res) => {
    try {
        const {title , content, category} = req.body;

        
        const blog = await Blog.create({
            title,
            content,
            category,
            author : req.user._id,
            image : req?.file?.path
        });
        await redisClient.del("blogs")
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
        await redisClient.del(`blog-${blog._id}`)
        await redisClient.del("blogs")
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
    await redisClient.del("blogs")
    await redisClient.del(`blog-${blog._id}`)
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
    let cachedData = await redisClient.get("blogs");
    let blogs;
    if(cachedData){
      console.log("Serving from redis")
      blogs = JSON.parse(cachedData)
      return res.status(status.OK).json({success : true , blogs })
    }

    blogs = await Blog.find({})
    
    await redisClient.setEx("blogs" , 60*60 , JSON.stringify(blogs));

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
    const CACHE_KEY = `blog-${blogId}`;

    const cachedData = await redisClient.get(CACHE_KEY);
    if(cachedData){
      const result = await JSON.parse(cachedData);
      console.log("Serving from redis")
      return res.status(status.OK).json({success : true , result})
    }


    const blog = await Blog.findById(blogId);


    if (!blog) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "Blog not found",
      });
    }

    await redisClient.setEx(CACHE_KEY, 60*5 , JSON.stringify(blog))
    return res.status(status.OK).json({ success: true, blog });
  } catch (error) {
    console.log("Get Blog Error ", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const toggleLike = async (req,res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;
    const blog = await Blog.findOne({ _id : blogId });

    if(!blog){
      return res.status(status.NOT_FOUND).json({success : false , message : "Blog liked before or not found"});
    }

    const alreadyLiked = blog.likedBy.includes(userId);

    if(alreadyLiked){
      blog.likedBy.pull(userId);
      blog.likesCount = Math.max(0 , blog.likesCount - 1);
      await blog.save();
      res.status(status.OK).json({success : true , message : "Blog DisLiked"});
    }
    else{
      blog.likedBy.push(userId);
      blog.likesCount += 1;
      await blog.save();
      res.status(status.OK).json({success : true , message : "Blog Liked"});
    }

    await redisClient.del(`blog-${blog._id}`)
    await redisClient.del("blogs")
    return;
  } catch (error) {
    console.log("Error in addLike " , error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({success : false , message : "Server Error"});
  }
}




export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;
    const message = req.body.message;

    const blog = await Blog.findById(blogId);
    if(!blog) return res.status(status.NOT_FOUND).json({success : false , "message" : "Blog Not found"});

    const comment = await Comment.create({
      blog : blogId,
      user : userId,
      message
    })

    return res.status(status.CREATED).json({success : true , "message" : "Commented" , comment})
  } catch (error) {
    console.log("Error in add comment ", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({success : false , "message" : "Server Error"})
  }
}


export const removeComment = async (req,res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findOneAndDelete({
      _id : commentId,
      user : req.user._id
    })

    if(!comment){
      return res.status(status.NOT_FOUND).json({success : false , message : "Commnet not found or not commented by you"})
    }

    return res.status(status.OK).json({success : true, message : "Comment Deleted"});
  } catch (error) {
    console.log("Error in Delete comment ", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({success : true, message : "Server Error"})
  }
};    



export const updateComment = async (req,res) => {
  try {
    const commentId = req.params.id;
    const message = req.body.message;
    const comment = await Comment.findOneAndUpdate(
      {
        _id : commentId,
        user : req.user._id
      },
      {
        $set : {message : message}
      },
      {
        new : true
      }
  )

    if(!comment){
      return res.status(status.NOT_FOUND).json({success : false , message : "Commnet not found or not commented by you"})
    }

    return res.status(status.OK).json({success : true, message : "Comment Updated" , comment});
  } catch (error) {
    console.log("Error in update comment", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({success : true, message : "Server Error"})
  }
};