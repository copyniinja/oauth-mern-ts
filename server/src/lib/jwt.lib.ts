import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import mongoose from "mongoose";
import { config } from "../config";
import { createError } from "./error.lib";
import logger from "./winston.lib";

/*
 Config
*/
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "2d";
const ACCESS_TOKEN_SECRET = config.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.REFRESH_TOKEN_SECRET;

/*
 Types 
*/
export interface IUserPayload extends JwtPayload {
  userId: mongoose.Types.ObjectId;
  email: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
}
export type Token = "ACCESS" | "REFRESH";

/**
 * Generate Access and Refresh token
 * - Set expiresIn according to environment variable
 * - Sign the token using secret key
 * @param userDetails User details payload
 * @param type ACCESS | REFRESH
 * @returns Generated jwt token
 * @throws Error if jwt_secret is not set
 */
export function generateToken(userDetails: IUserPayload, type: Token) {
  const { exp, iat, sub, ...safePayload } = userDetails;
  const options: SignOptions = {
    expiresIn: type === "ACCESS" ? ACCESS_TOKEN_EXPIRY : REFRESH_TOKEN_EXPIRY,
    subject: type,
  };
  const secretKey =
    type === "ACCESS" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  try {
    return jwt.sign(safePayload, secretKey, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : error;
    logger.error(message);
    throw error;
  }
}

/**
 * Verify Access and Refresh token
 * - Throw error accordingly
 * @param token Jwt token send by client
 * @param type ACCESS | REFRESH
 * @returns Payload User details that are signed inside token
 * @throws Error if refresh token is invalid, expired, failed verification
 */
export function verifyToken(token: string, type: Token) {
  const secretKey =
    type === "ACCESS" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  try {
    const payload = jwt.verify(token, secretKey) as IUserPayload;
    return payload;
  } catch (error: any) {
    // Token expired
    if (error.name === "TokenExpiredError") {
      throw createError(401, "Token expired");
    }
    // Invalid token / signature
    if (error.name === "JsonWebTokenError") {
      throw createError(401, "Invalid token");
    }
    // Any Other error
    throw createError(401, "Token verification failed");
  }
}
