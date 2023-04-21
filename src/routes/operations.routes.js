import {Router} from 'express';
import { postOp, getOp } from '../controllers/operations.controller.js';

const opRouter = Router();
opRouter.post("/nova-transacao/:tipo", postOp);
opRouter.get("/transacoes", getOp);

export default opRouter;