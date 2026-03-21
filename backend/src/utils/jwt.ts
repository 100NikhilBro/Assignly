import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";


export const generateToken = (payload: { id: string; email: string }) => {
  console.log("Generating token for user:", payload.id);
  
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };

  const token = jwt.sign(payload, env.JWT_SECRET, options);
  console.log("token generated");
  return token;
};

=
export const verifyToken = (token: string) => {
  try {
    console.log("Verifying token...");
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
    };
    console.log("Token verified for user:", decoded.id);
    return decoded;
  } catch (error) {
    console.log("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
};
