import { Request, Response } from "express";
import { findOrCreateUser } from "./auth.service";
import { generateToken } from "../../utils/jwt";

export const googleAuthController = async (req: Request, res: Response) => {
  try {
    const { email, name, googleId } = req.body;
    const guestSessionId = req.headers["x-session-id"] as string;
    
    console.log("\n🔐 ========== GOOGLE AUTH ==========");
    console.log("Email:", email);
    console.log("Guest Session ID:", guestSessionId);
    console.log("===================================\n");

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await findOrCreateUser({ email, name, googleId, guestSessionId });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    console.log("✅ Login successful for:", user.email);
    console.log("💰 Credits:", user.credits);
    console.log("🔑 Token generated\n");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        credits: user.credits,
      },
    });

  } catch (error) {
    console.error("❌ Auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};