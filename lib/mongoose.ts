import mongoose from 'mongoose';

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trusted-brother';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached: MongooseCache | undefined = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
} else if (!cached.conn || !cached.promise) {
  cached.conn = null;
  cached.promise = null;
}

async function dbConnect() {
  if (!cached) {
    throw new Error('Mongoose cache is not initialized');
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('MongoDB Connected');
      return mongoose.connection;
    }).catch((err) => {
      console.error('MongoDB Connection Error:', err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
