import { Router } from "express";
import { postOp, getOp } from "../controllers/operations.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { validateIdSchema } from "../middlewares/validateIdSchema.middleware.js";
import opSchema from "../schemas/op.schema.js";
import typeSchema from "../schemas/opType.schema.js";

const opRouter = Router();
opRouter.post(
  "/nova-transacao/:tipo",
  validateSchema(opSchema),
  validateIdSchema(typeSchema),
  postOp
);
opRouter.get("/transacoes", getOp);

export default opRouter;
