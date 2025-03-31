import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const options = {
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('Connected to MongoDB');
    
    // Only verify indexes exist without trying to recreate them
    if (mongoose.models.Artist) {
      const indexes = await mongoose.models.Artist.listIndexes();
      console.log('Artist indexes:', indexes.map(idx => idx.name));
    }
    if (mongoose.models.Release) {
      const indexes = await mongoose.models.Release.listIndexes();
      console.log('Release indexes:', indexes.map(idx => idx.name));
    }
  } catch (error) {
    if (error.message.includes('index')) {
      console.warn('Index verification warning:', error.message);
      // Continue execution despite index warnings
      return;
    }
    console.error('MongoDB connection error:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}