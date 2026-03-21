// import { User } from "../user/user.model";
// import { IUser } from "../../types/user.types";

// export const findOrCreateUser = async (data: {
//   email: string;
//   name?: string;
//   googleId?: string;
// }): Promise<IUser> => {
//   const { email, name, googleId } = data;

//   let user = await User.findOne({ email });

//   if (!user) {
//     user = await User.create({
//       email,
//       name,
//       googleId,
//       credits: 30,
//     });
//   }

//   return user;
// };

import { User } from "../user/user.model";
import { Assignment } from "../assignemnt/assignment.model";
import { IUser } from "../../types/user.types";

export const findOrCreateUser = async (data: {
  email: string;
  name?: string;
  googleId?: string;
  guestSessionId?: string;  // ✅ Add this
}): Promise<IUser> => {
  const { email, name, googleId, guestSessionId } = data;

  let user = await User.findOne({ email });

  if (!user) {
    // Create new user
    user = await User.create({
      email,
      name,
      googleId,
      credits: 30,
    });
    
    // ✅ Migrate guest assignments to this user
    if (guestSessionId) {
      const migratedCount = await Assignment.updateMany(
        { 
          guestSessionId: guestSessionId, 
          userId: { $eq: null }  // Only assignments without userId
        },
        { 
          $set: { 
            userId: user._id, 
            guestSessionId: null 
          } 
        }
      );
      console.log(`Migrated ${migratedCount.modifiedCount} guest assignments for session: ${guestSessionId}`);
    }
  } else {
    // ✅ User exists, still check if any guest assignments to migrate
    if (guestSessionId) {
      const migratedCount = await Assignment.updateMany(
        { 
          guestSessionId: guestSessionId, 
          userId: { $eq: null } 
        },
        { 
          $set: { 
            userId: user._id, 
            guestSessionId: null 
          } 
        }
      );
      if (migratedCount.modifiedCount > 0) {
        console.log(`Migrated ${migratedCount.modifiedCount} guest assignments to existing user: ${user.email}`);
      }
    }
  }

  return user;
};