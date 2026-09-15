import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

// Fix Node.js Windows SRV DNS resolution if needed
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const uri = process.env.MONGODB_URI || 'mongodb+srv://srikari_admin:46WBxRyJNaDZE8OV@cluster0.dm3i9nk.mongodb.net/srikari_atirudram?retryWrites=true&w=majority';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
  });

  await client.connect();
  const db = client.db('srikari_atirudram');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
