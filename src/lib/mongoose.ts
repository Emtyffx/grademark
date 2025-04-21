import { env } from "@/env";
import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  import("./models/User");
  import("./models/Session");

  return cached.conn;
}
