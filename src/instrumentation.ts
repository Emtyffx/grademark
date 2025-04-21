import { connectToDatabase } from "./lib/mongoose";

export async function register() {
  await connectToDatabase();
}
