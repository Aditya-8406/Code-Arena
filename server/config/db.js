const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongoServerInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      try {
        console.log(`[Database] Attempting connection to configured MongoDB URI...`);
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`[Database] Connected to MongoDB host: ${conn.connection.host}`);
        return conn;
      } catch (externalErr) {
        console.warn(`[Database] External MongoDB connection failed (${externalErr.message}).`);
        console.log(`[Database] Falling back to embedded persistent MongoMemoryServer...`);
      }
    }

    // Fallback: Use persistent embedded MongoDB instance
    console.log(`[Database] Initializing embedded MongoDB engine...`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    
    // Persistent directory for embedded MongoDB
    const dbPath = path.resolve(__dirname, '../../.data/db');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    mongoServerInstance = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath,
        storageEngine: 'wiredTiger',
      },
    });

    const uri = mongoServerInstance.getUri('codearena');
    console.log(`[Database] Embedded MongoDB running at: ${uri}`);
    const conn = await mongoose.connect(uri);
    console.log(`[Database] Connected to Embedded MongoDB successfully. Data persisted in .data/db`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServerInstance) {
      await mongoServerInstance.stop();
    }
    console.log(`[Database] Disconnected.`);
  } catch (error) {
    console.error(`[Database Error] Error during disconnect: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
