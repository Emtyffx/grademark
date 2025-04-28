import { env } from "@/env";
import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(url: string | null = null) {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(url || env.MONGO_URI, {
      bufferCommands: true,
    });
  }

  cached.conn = await cached.promise;

  import("./models/User");
  import("./models/Session");
  import("./models/School");

  return cached.conn;
}
