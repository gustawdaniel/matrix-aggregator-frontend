import { Db, MongoClient } from "mongodb";

export async function connectDb(): Promise<Db> {
  const mongoUri = process.env.MONGO_URI as string; // Mongo URI from environment variables
  const client = new MongoClient(mongoUri, { ignoreUndefined: true });

  await client.connect();
  return client.db("matrix_aggregator");
}
