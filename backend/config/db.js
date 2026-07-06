const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('  => using existing database connection');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log(`  ✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`  ❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
