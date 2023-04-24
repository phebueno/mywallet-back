import { Router } from "express";
import {
  postOp,
  getOp,
  deleteOp,
  editOp,
} from "../controllers/operations.controller.js";
import { validateSchema } from "../middlewares/validateBodySchema.middleware.js";
import { validateIdSchema } from "../middlewares/validateIdSchema.middleware.js";
import { validateAuth } from "../middlewares/validateAuth.middleware.js";
import { dataSanitize } from "../middlewares/sanitizeData.middleware.js";
import opSchema from "../schemas/op.schema.js";
import idSchema from "../schemas/opID.schema.js";

const opRouter = Router();
opRouter.use(validateAuth);
opRouter.post(
  "/nova-transacao",
  dataSanitize,
  validateSchema(opSchema),
  postOp
);
opRouter.get("/transacoes", getOp);
opRouter.delete("/transacao/:id", validateIdSchema(idSchema), deleteOp);
opRouter.put(
  "/editar-transacao/:id",
  dataSanitize,
  validateSchema(opSchema),
  validateIdSchema(idSchema),
  editOp
);

export default opRouter;
