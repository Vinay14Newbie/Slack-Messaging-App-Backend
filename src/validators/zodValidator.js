export const validate = (schema) => {
  // schema- what are the excepted input properties for this particular schema bodyy
  return async (req, res, next) => {
    try {
      console.log(req.body);

      schema.parse(req.body); //schema object is created by zod
      // parse() it will check whether the incoming the js object is validating schema or not
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
  };
};
