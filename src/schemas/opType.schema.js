import joi from "joi";

const typeSchema = joi.object({
    type: joi.valid("entrada", "saida").required(),
  });

export default typeSchema;