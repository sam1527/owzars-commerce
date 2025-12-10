import mongoose, { Schema, models } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  name?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String },
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
