import { Router } from "express";
import {
  postOp,
  getOp,
  deleteOp,
} from "../controllers/operations.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { validateIdSchema } from "../middlewares/validateIdSchema.middleware.js";
import { validateAuth } from "../middlewares/validateAuth.middleware.js";
import opSchema from "../schemas/op.schema.js";
import typeSchema from "../schemas/opType.schema.js";
import idSchema from "../schemas/opID.schema.js";

const opRouter = Router();
opRouter.use(validateAuth);
opRouter.post(
  "/nova-transacao/:tipo",
  validateSchema(opSchema),
  validateIdSchema(typeSchema),
  postOp
);
opRouter.get("/transacoes", getOp);
opRouter.delete("/transacao/:id", validateIdSchema(idSchema), deleteOp);

export default opRouter;
