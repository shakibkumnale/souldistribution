// render-start.js - Special startup script for Render deployment
const { spawn } = require('child_process');
const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable is not set');
  process.exit(1);
}

// Connection options optimized for Render
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

console.log('Attempting to connect to MongoDB before starting the application...');

// Try to connect to MongoDB first
mongoose.connect(MONGODB_URI, options)
  .then(() => {
    console.log('✅ MongoDB connected successfully, starting Next.js application');
    
    // Start the Next.js application
    const nextApp = spawn('node', ['./.next/server.js'], {
      stdio: 'inherit',
      env: process.env
    });
    
    // Handle Next.js process events
    nextApp.on('close', (code) => {
      console.log(`Next.js process exited with code ${code}`);
      process.exit(code);
    });
    
    // Handle termination signals
    process.on('SIGINT', () => {
      console.log('Received SIGINT, gracefully shutting down...');
      mongoose.connection.close()
        .then(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        })
        .catch(err => {
          console.error('Error closing MongoDB connection:', err);
          process.exit(1);
        });
    });
    
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, gracefully shutting down...');
      mongoose.connection.close()
        .then(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        })
        .catch(err => {
          console.error('Error closing MongoDB connection:', err);
          process.exit(1);
        });
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
