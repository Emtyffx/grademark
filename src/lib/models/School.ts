import mongoose, { Model, Schema } from "mongoose";

export interface ISchool extends Document {
  name: string;
}

export const schoolSchema = new Schema({
  name: { type: String, required: true },
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.School;
}

export default (mongoose.models.School as Model<ISchool>) ||
  mongoose.model<ISchool>("School", schoolSchema);
