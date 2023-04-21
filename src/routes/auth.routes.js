import {Router} from 'express';
import { signin, signup } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validateSchema.middleware.js';
import userSchema from '../schemas/user.schema.js';
import loginSchema from '../schemas/login.schema.js';

const authRouter = Router();
authRouter.post("/sign-up", validateSchema(userSchema), signup);
authRouter.post("/sign-in", validateSchema(loginSchema), signin);

export default authRouter;