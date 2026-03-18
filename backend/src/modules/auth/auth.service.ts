import { User } from "../user/user.model";
import { IUser } from "../../types/user.types";

export const findOrCreateUser = async (data: {
  email: string;
  name?: string;
  googleId?: string;
}): Promise<IUser> => {
  const { email, name, googleId } = data;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      googleId,
      credits: 30,
    });
  }

  return user;
};