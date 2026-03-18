import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;

  name?: string;
  email: string;
  googleId?: string;
  password?: string;

  credits: number;

  role: "guest" | "user";

  createdAt: Date;
  updatedAt: Date;
}