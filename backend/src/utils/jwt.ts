import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

// 🔐 Generate Token
export const generateToken = (payload: { id: string; email: string }) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

// 🔍 Verify Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};