import mongoose from "mongoose";
const DB_URL = process.env.MONGODB_URL;

if (!DB_URL) {
  console.log("MongoDb Url is missing!");
}

let cached = { conn: null, promise: null };

async function connectToDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(DB_URL, { bufferCommands: false, maxPoolSize: 10 })
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
  
    throw err;
  }

  return cached.conn;
}

export default connectToDb;
