import { Types } from "mongoose";
import { hashString } from "../lib/bcrypt.lib";
import Token, { IToken } from "../models/token.model";

const REFRESH_TOKEN_EXPIRY_IN_DAYS = 2;

/**
 * Save refresh token to the database
 *  Set expiry date
 *  Hash the token
 *  Add or replace the token
 * @param userId Users Id no
 * @param token  refresh token
 * @returns refresh token
 * @throws 500 internal server error
 */
export async function registerToken(userId: Types.ObjectId, token: string) {
  // Set expiry date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_IN_DAYS);

  // Hashing the token
  const hashedToken = await hashString(token);

  // Save in the database
  const savedToken: IToken = await Token.findOneAndUpdate(
    { userId },
    { userId, token: hashedToken, expiresAt },
    { upsert: true, new: true }
  );

  return savedToken;
}

/**
 * Delete refresh token for a user.
 * Used during logout.
 * @param userId User's ObjectId
 * @throws 500 internal server error
 */
export async function deleteToken(userId: Types.ObjectId) {
  await Token.deleteOne({ userId });
}

/**
 * get refresh token by userId.
 * Used during reissue an access token.
 * @param userId User's ObjectId
 * @throws 500 internal server error
 */
export async function getTokenByUserId(userId: Types.ObjectId) {
  return (await Token.findOne({ userId })) as IToken;
}
