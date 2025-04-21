import mongoose, { Model, PopulatedDoc, Schema } from "mongoose";
import { IUser } from "./User";

export interface ISession extends Document {
  _id: Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
  user: PopulatedDoc<IUser>;
}

export const sessionSchema = new Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Session;
}

export default (mongoose.models.Session as Model<ISession>) ||
  mongoose.model("Session", sessionSchema);
