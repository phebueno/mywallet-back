import joi from "joi";
import { v4 as uuid } from "uuid";
import { db } from "../app.js";
import bcrypt from "bcrypt";

export async function signup(req, res){
    const { name, email, password } = req.body;

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
  }


export async function signin(req, res){
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
  }