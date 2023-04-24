import joi from "joi";

const typeSchema = joi.object({
    tipo: joi.valid("entrada", "saida").required(),
  });

export default typeSchema;