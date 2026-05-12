import { MongoClient, Db } from 'mongodb';

const URI = 'mongodb+srv://zerdendereli:W4k1Tui0BBzOwDO5@zeddy35.xlbc6ia.mongodb.net/final_project?appName=zeddy35';

let client: MongoClient | null = null;

export async function getDb(): Promise<Db> {
  if (!client) {
    client = new MongoClient(URI);
    await client.connect();
  }
  return client.db('final_project');
}
