import { config } from "../config";
import { hashString } from "../lib/bcrypt.lib";
import { createError } from "../lib/error.lib";
import User, { IUser } from "../models/user.model";

/**
 * Register user to the database
 * - Check if the user is already exists
 * - Hash user password
 * - Check if the user email in admin list
 * - create user in database
 * @param userDetails User info(name,email,password,provider,role,profileImage)
 * @returns user Newly created user
 * @throws 400 if user already exists
 */
export async function createUser(userDetails: IUser) {
  const { email, password, name, profileImage } = userDetails;
  // Check if user exists
  const user = await getUserByEmail(email);
  if (user) {
    throw createError(400, "User already exists");
  }
  // Hash user password (if exists)
  let hashedPassword: string | null = null;
  if (password) {
    hashedPassword = await hashString(password);
  }
  let role: "CUSTOMER" | "ADMIN" | "SELLER" = "CUSTOMER";
  // Check if the email is in ADMIN_LIST
  if (config.ADMIN_LIST.includes(email)) {
    role = "ADMIN";
  }
  // Save user in the database
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    profileImage: profileImage || null,
    providers: {
      type: "credentials",
    },
  });
  // return newly created user without password
  const { password: _, ...createdUser } = newUser.toObject();
  return createdUser;
}

/**
 * Get user details by email
 * @param email Email of the user
 * @returns User document if exists or null
 */
export async function getUserByEmail(email: string) {
  return await User.findOne({ email }).lean();
}
