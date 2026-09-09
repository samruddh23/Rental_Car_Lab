import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rental_car_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000, // Timeout fast if local mongod is not running
    });

    isConnected = true;
    console.log(`=========================================`);
    console.log(` MongoDB Connected Successfully!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(`=========================================`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`\n⚠️  [MongoDB Warning]: Unable to connect to MongoDB at "${mongoURI}"`);
    console.warn(`   Reason: ${error.message}`);
    console.warn(`💡 [Fallback Mode]: Server will run with in-memory storage so your app continues working.`);
    console.warn(`   To persist data to MongoDB:`);
    console.warn(`   1. Start local MongoDB (mongod / MongoDB Compass), OR`);
    console.warn(`   2. Provide your MongoDB Atlas URI in server/.env (MONGO_URI=...)\n`);
    return false;
  }
};

export const isDBConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

export default connectDB;
