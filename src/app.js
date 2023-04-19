import express from "express";
import cors from "cors";
import { MongoClient} from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { signin, signup } from "./controllers/authController.js";
import { getOp, postOp } from "./controllers/operationsController.js";

// Criação do servidor
const app = express();

// Configurações
app.use(express.json());
app.use(cors());
dotenv.config();

// Setup do Banco de Dados
export let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient
  .connect()
  .then(() => (db = mongoClient.db()))
  .catch((err) => console.log(err.message));

// Endpoints //
app.post("/sign-up", signup);

app.post("/sign-in", signin);

app.post("/nova-transacao/:tipo", postOp);

app.get("/transacoes", getOp);

// Deixa o app escutando, à espera de requisições
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));




