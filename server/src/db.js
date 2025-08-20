import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';

export async function connectDB() {
  const uri = MONGO_URI || 'mongodb://localhost:27017';
  if (!MONGO_URI) console.log('[db] MONGO_URI not set, defaulting to mongodb://localhost:27017 (dev)');
  await mongoose.connect(uri, { dbName: 'bigdata_dashboard' });
  console.log('[db] Connected to MongoDB at', uri);
}

export const mongooseInstance = mongoose;
