// import { Request, Response, NextFunction } from "express";
// import { verifyToken } from "../utils/jwt";

// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const decoded = verifyToken(token);

//     (req as any).user = decoded;

//     next();

//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }
// };




import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🔑 Auth Middleware - Header:", authHeader);
    
    const token = authHeader?.split(" ")[1];

    if (!token) {
      console.log("❌ No token found, treating as guest");
      (req as any).user = null;
      return next();
    }

    console.log("🔍 Verifying token:", token.substring(0, 30) + "...");
    
    const decoded = verifyToken(token);
    console.log("✅ Token verified, user:", decoded);
    
    (req as any).user = decoded;
    next();

  } catch (error) {
    console.log("❌ Token verification failed:", error);
    (req as any).user = null;
    next();
  }
};