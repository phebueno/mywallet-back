import {Router} from 'express';
import authRouter from './auth.routes.js';
import opRouter from './operations.routes.js';

const router = Router();
router.use(authRouter);
router.use(opRouter);

export default router;