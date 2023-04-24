import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { db } from "../database/database.connection.js";

export async function postOp(req, res) {
  const { tipo: type } = req.params;  
  const user = res.locals.user;

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
  const {user, session} = res.locals;
  //Recuperar lista de transações
  const opsUser = await db
    .collection("operations")
    .find({
      userId: new ObjectId(session.userId),
    })
    .toArray();
  res.send({ user: user.name, opsUser });
}

export async function deleteOp(req, res){
  const {user, session} = res.locals;
  const {id} = req.params;
  try {
    const opToBeDeleted = await db.collection("operations").findOne({
      userId: new ObjectId(session.userId),
      _id: new ObjectId(id)
    })
    if (!opToBeDeleted) return res.sendStatus(404);
    const opDeleted = await db.collection("operations").deleteOne({
      _id: new ObjectId(id)
    })
    if (opDeleted.deletedCount !== 0){
      res.status(202).send(opDeleted);
    }
    else res.sendStatus(204);
    
  } catch (error) {
    console.log(error);
  }  
}