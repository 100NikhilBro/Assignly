import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types/user.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    googleId: {
      type: String,
    },

    password: {
      type: String,
    },

    credits: {
      type: Number,
      default: 30,
      min: 0,
    },

    role: {
      type: String,
      enum: ["guest", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);