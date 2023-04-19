import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

// Criação do servidor
const app = express();

// Configurações
app.use(express.json());
app.use(cors());
dotenv.config();

// Setup do Banco de Dados
let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient
  .connect()
  .then(() => (db = mongoClient.db()))
  .catch((err) => console.log(err.message));

// Endpoints //

//Cadastro
app.post("/sign-up", async (req, res) => {
  const { name, email, password } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    await db
      .collection("users")
      .insertOne({ name, email, password: passwordHash });
    res.status(201).send("Usuário cadastrado com sucesso!");
  } catch (error) {
    console.log(error.message);
  }
});

//Login
app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) res.status(422).send("Usuário não cadastrado");
    if (!bcrypt.compareSync(password, user.password))
      res.status(401).send("Senha incorreta.");

    //Criação de sessão
    const token = uuid();

    await db.collection("sessions").insertOne({ userId: user._id, token });
    res.status(200).send(token);
  } catch (error) {
    console.log(error.message);
  }
});

//Adiciona operação
app.post("/nova-transacao/:tipo", async (req, res) => {
  const { value, description } = req.body;
  const { tipo: type } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if(!token) return res.sendStatus(401);
  const session = await db.collection("sessions").findOne({ token });
  if(!session ) return res.sendStatus(401);

  //Adicionar transação
  res.send(200);
});

// Deixa o app escutando, à espera de requisições
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
