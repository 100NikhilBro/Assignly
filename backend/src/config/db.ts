import mongoose from "mongoose";
import { env } from './env';

export const dbConnect = async () => {
  try {
    await mongoose.connect(env.DB_URL, {
      ssl: true,
      tlsAllowInvalidCertificates: true, // For Atlas
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};
