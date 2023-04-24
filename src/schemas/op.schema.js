import joi from "joi";

const opSchema = joi.object({
    value: joi.number().precision(2).sign("positive").strict().required(),
    description: joi.string().required(),
    type: joi.valid("entrada", "saida").required()
  });

export default opSchema;