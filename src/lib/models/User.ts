import mongoose, { Model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  hashedPass: string;
  name: string;
  role: "admin" | "teacher" | "student";
}
export interface ClientUser {
  email: string;
  name: string;
  avatarURL?: string;
}

export const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  hashedPass: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "admin",
  },
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User;
}

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export function serializeUser(
  user: IUser | null | undefined,
): ClientUser | null {
  if (!user) return null;
  return {
    name: user.name,
    email: user.email,
  };
}
