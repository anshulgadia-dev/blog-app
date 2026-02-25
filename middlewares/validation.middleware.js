function validate(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    console.log("I am inside validation middleware all ok")
    next();
  };
}

export default validate;