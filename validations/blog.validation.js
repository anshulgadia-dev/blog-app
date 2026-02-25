import Joi from "joi";

export const createBlogSchema = Joi.object({
    title : Joi.string().min(3).max(50).required(),
    content : Joi.string().min(3).max(10000).required(),
    category : Joi.string().min(3).max(20).required()
})