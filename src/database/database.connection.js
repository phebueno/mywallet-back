import { MongoClient} from "mongodb";
import dotenv from "dotenv";


dotenv.config();

export let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient
  .connect()
  .then(() => (db = mongoClient.db("myWallet")))
  .catch((err) => console.log(err.message));