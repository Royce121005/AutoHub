const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let memoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autohub';
  
  // 1. Try primary configured URI
  try {
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (primaryError) {
    console.warn(`Could not connect to ${primaryUri}: ${primaryError.message}`);
  }

  // 2. If primary was not localhost, try local MongoDB at 127.0.0.1:27017
  const localDefaultUri = 'mongodb://127.0.0.1:27017/autohub';
  if (primaryUri !== localDefaultUri) {
    try {
      console.log(`Attempting to connect to local MongoDB at ${localDefaultUri}...`);
      const conn = await mongoose.connect(localDefaultUri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (localError) {
      console.warn(`Local MongoDB not active: ${localError.message}`);
    }
  }

  // 3. Fallback: Automatically spin up embedded MongoDB instance with persistent storage
  try {
    console.log('Starting embedded local MongoDB instance for seamless offline development...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbPath = path.join(__dirname, '..', 'data', 'db');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    try {
      memoryServer = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbPath,
          storageEngine: 'wiredTiger'
        }
      });
    } catch (portErr) {
      // If port 27017 had conflict, let it pick an available random port
      console.warn(`Port 27017 unavailable (${portErr.message}). Using dynamic port.`);
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbPath,
          storageEngine: 'wiredTiger'
        }
      });
    }

    const embeddedUri = memoryServer.getUri() + 'autohub';
    const conn = await mongoose.connect(embeddedUri);
    console.log(`Embedded Local MongoDB Connected: ${embeddedUri}`);

    // Register cleanup hooks
    const cleanup = async () => {
      try {
        await mongoose.disconnect();
        if (memoryServer) {
          await memoryServer.stop();
        }
      } catch (e) {
        // ignore shutdown error
      }
      process.exit(0);
    };

    process.once('SIGINT', cleanup);
    process.once('SIGTERM', cleanup);

    return conn;
  } catch (embeddedError) {
    console.error(`Failed to launch embedded MongoDB: ${embeddedError.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
