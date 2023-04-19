import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import joi from "joi";
import dayjs from "dayjs";

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

//Validações
const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

const opSchema = joi.object({
  value: joi.number().precision(2).sign("positive").required(),
  description: joi.string().required(),
  type: joi.valid("entrada", "saida").required(),
});

// Endpoints //

//Cadastro
app.post("/sign-up", async (req, res) => {
  const { name, email, password } = req.body;

  const validation = userSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const unavailableEmail = await db.collection("users").findOne({ email });
    if (unavailableEmail)
      return res.status(409).send("Este email já está cadastrado!");
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

  const validation = loginSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

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

//Adiciona transação
app.post("/nova-transacao/:tipo", async (req, res) => {
  const { value, description } = req.body;
  const { tipo: type } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);
  const session = await db.collection("sessions").findOne({ token });
  if (!session) return res.sendStatus(401);
  const user = await db.collection("users").findOne({
    _id: session.userId,
  });

  const validation = opSchema.validate(
    { ...req.body, type },
    { abortEarly: false }
  );

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  //Adicionar operação
  try {
    delete user.password; //é necessário?
    await db.collection("operations").insertOne({userId:user._id, ...req.body, type, opTimeStamp: Date.now()});
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
  }  
});

// Deixa o app escutando, à espera de requisições
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
