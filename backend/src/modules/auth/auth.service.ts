import { User } from "../user/user.model";
import { Assignment } from "../assignemnt/assignment.model";
import { IUser } from "../../types/user.types";

export const findOrCreateUser = async (data: {
  email: string;
  name?: string;
  googleId?: string;
  guestSessionId?: string;
}): Promise<IUser> => {
  const { email, name, googleId, guestSessionId } = data;

  console.log("\n🔍 ========== FIND OR CREATE USER ==========");
  console.log("Email:", email);
  console.log("Guest Session ID:", guestSessionId);
  console.log("===========================================\n");

  let user = await User.findOne({ email });

  if (!user) {
    console.log("📝 Creating new user...");
    user = await User.create({
      email,
      name,
      googleId,
      credits: 30,
    });
    console.log("✅ New user created:", user._id);
  } else {
    console.log("✅ Existing user found:", user._id);
    console.log("💰 Current credits:", user.credits);
  }

  // ✅ MIGRATE GUEST ASSIGNMENTS
  if (guestSessionId) {
    console.log("\n🔍 Looking for guest assignments with sessionId:", guestSessionId);
    
    const guestAssignments = await Assignment.find({ guestSessionId, userId: null });
    console.log(`📦 Found ${guestAssignments.length} guest assignments to migrate`);
    
    if (guestAssignments.length > 0) {
      const result = await Assignment.updateMany(
        { guestSessionId, userId: null },
        { $set: { userId: user._id, guestSessionId: null } }
      );
      console.log(`✅ Migrated ${result.modifiedCount} guest assignments to user ${user._id}`);
    } else {
      console.log("ℹ️ No guest assignments found for this session");
    }
  } else {
    console.log("❌ No guestSessionId provided");
  }

  console.log("\n✅ User ready:", user.email, "Credits:", user.credits, "\n");
  
  return user;
};