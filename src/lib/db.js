import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Set mongoose debug mode for development environments
mongoose.set('debug', process.env.NODE_ENV === 'development');

// Set up connection options
const options = {
  bufferCommands: false,
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 90000, // 90 seconds
  socketTimeoutMS: 60000, // 60 seconds
  family: 4, // Use IPv4, skip trying IPv6
  connectTimeoutMS: 60000, // 60 seconds
  heartbeatFrequencyMS: 10000, // Check connection every 10 seconds
  retryWrites: true,
  retryReads: true,
  maxIdleTimeMS: 60000, // Close idle connections after 60 seconds
};

// Global connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connection function with retry logic
export async function connectToDatabase() {
  // If we have an existing connection, return it
  if (cached.conn) {
    console.log('Using existing mongoose connection');
    return cached.conn;
  }

  // If a connection attempt is in progress, wait for it
  if (cached.promise) {
    console.log('Waiting for existing mongoose connection promise');
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      console.error('Previous connection attempt failed, retrying:', error.message);
      cached.promise = null; // Reset the promise so we can try again
    }
  }

  // Set up connection with retry logic
  console.log('Connecting to MongoDB...');
  cached.promise = new Promise(async (resolve, reject) => {
    try {
      // Clear any existing connections
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
      
      // Connect to MongoDB
      const conn = await mongoose.connect(MONGODB_URI, options);
      console.log('MongoDB connected successfully');
      
      // Handle connection errors
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        if (!cached.conn) {
          reject(err);
        }
      });
      
      // Handle disconnection
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected, attempting to reconnect...');
        cached.conn = null;
        cached.promise = null;
      });
      
      // Handle successful reconnection
      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected successfully');
      });
      
      resolve(conn);
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      reject(error);
    }
  });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// For backward compatibility
export default connectToDatabase;