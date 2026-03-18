import { User } from "./user.model";
import { IUser } from "../../types/user.types";

export const getUserProfile = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId).select("-password");
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  delete (data as any).password;
  delete (data as any).credits;
  delete (data as any).role;

  return await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  ).select("-password");
};