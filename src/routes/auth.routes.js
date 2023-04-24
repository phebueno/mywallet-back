import {Router} from 'express';
import { signin, signup } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validateBodySchema.middleware.js';
import {dataSanitize} from "../middlewares/sanitizeData.middleware.js";
import userSchema from '../schemas/user.schema.js';
import loginSchema from '../schemas/login.schema.js';

const authRouter = Router();
authRouter.post("/sign-up", dataSanitize, validateSchema(userSchema), signup);
authRouter.post("/sign-in", dataSanitize, validateSchema(loginSchema), signin);

export default authRouter;