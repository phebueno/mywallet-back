import dayjs from "dayjs";
import joi from "joi";
import { ObjectId } from "mongodb";
import { db } from "../app.js";

export async function postOp(req, res) {
  const { tipo: type } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);
  const session = await db.collection("sessions").findOne({ token });
  if (!session) return res.sendStatus(401);
  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.userId),
  });

  //Adicionar operação
  try {
    delete user.password; //é necessário?
    await db.collection("operations").insertOne({
      userId: user._id,
      ...req.body,
      type,
      opDate: dayjs().format("DD/MM"),
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
  }
}

export async function getOp(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);
  const session = await db.collection("sessions").findOne({ token });
  if (!session) return res.sendStatus(401);
  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.userId),
  });
  if (!user) return res.sendStatus(401);
  //Recuperar lista de transações
  const opsUser = await db
    .collection("operations")
    .find({
      userId: new ObjectId(session.userId),
    })
    .toArray();
  res.send({ user: user.name, opsUser });
}
