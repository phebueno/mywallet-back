import { db } from "../database/database.connection.js";
import { ObjectId } from "mongodb";

export async function validateAuth(req,res,next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);
    const session = await db.collection("sessions").findOne({ token });
    if (!session) return res.sendStatus(401);
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.userId),
    });
    if (!user) return res.sendStatus(401);
    res.locals = {user, session};
    next();
}
