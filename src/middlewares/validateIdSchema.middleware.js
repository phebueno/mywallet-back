export function validateIdSchema(schema) {
    return (req, res, next) => {
        const { tipo: type } = req.params;
        const validation = schema.validate({type}, { abortEarly: false });

        if (validation.error) {
          const errors = validation.error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
        }
      next();
    };
  }