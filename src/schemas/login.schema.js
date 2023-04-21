import joi from "joi";

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).required(),
  });

  export default loginSchema;