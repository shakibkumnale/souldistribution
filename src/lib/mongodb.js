import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Connection options with proper timeout settings
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 30000, // 30 seconds
  connectTimeoutMS: 30000, // 30 seconds
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let cached = global.mongodb;

if (!cached) {
  cached = global.mongodb = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB with native driver...');
    cached.promise = MongoClient.connect(MONGODB_URI, options)
      .then((client) => {
        console.log('MongoDB connected successfully with native driver');
        return {
          client,
          db: client.db(),
        };
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        cached.promise = null;
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset the promise if connection fails
    cached.promise = null;
    throw error;
  }
} 