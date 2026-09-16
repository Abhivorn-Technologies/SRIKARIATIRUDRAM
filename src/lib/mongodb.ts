import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

// Set public DNS servers to prevent Windows querySrv ECONNREFUSED issues with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setServers is restricted (e.g. Serverless/Edge)
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const options = {
  serverSelectionTimeoutMS: 15000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalWithMongo = global as unknown as GlobalWithMongo;

let clientPromise: Promise<MongoClient>;

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect();
}
clientPromise = globalWithMongo._mongoClientPromise;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise;
    const db = client.db('srikari_atirudram');
    return { client, db };
  } catch (error) {
    // Reset cached promise on rejection so subsequent reconnect attempts can retry
    delete globalWithMongo._mongoClientPromise;
    throw error;
  }
}

export default clientPromise;

