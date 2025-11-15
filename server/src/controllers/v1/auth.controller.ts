import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import passport from "passport";
import { generateToken } from "server/src/lib/jwt.lib";
import logger from "server/src/lib/winston.lib";
import { IUser } from "server/src/models/user.model";
import { createUser } from "server/src/services/user.service";

/**
 * Handles user login process using passport local strategy
 * - Generate and returns authentication token
 * - Save refresh token inside cookie
 * @param req Request object containing login credential in body
 * @param res Response object
 * @returns JSON response with user id and token
 * @throws 500 Internal server error for database or token failure
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "local",
    { session: false },
    (
      err: any,
      user:
        | (Omit<IUser, "password"> & { _id: mongoose.Types.ObjectId })
        | false,
      info: { message: string }
    ) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400).json({ success: false, message: info?.message });
      }
      // Generate access and refresh token
      const accessToken = generateToken(
        { userId: user._id, ...user },
        "ACCESS"
      );
      const refreshToken = generateToken(
        { userId: user._id, ...user },
        "REFRESH"
      );
      res.cookie("refresh", refreshToken, {
        httpOnly: true,
        maxAge: 3600 * 24 * 2,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json({ user, accessToken });
    }
  )(req, res, next);
}

// export async function login(req: Request, res: Response, next: NextFunction) {
//   passport.authenticate("local", { session: false }, (err,user,info) => {})(req, res, next);
// }

/**
 * Handles user register process
 * - Save user in database
 * @param req Request object containing user info in body
 * @param res Response object
 * @returns 201 success JSON response
 * @throws 500 Internal server error for database
 */
export async function register(req: Request, res: Response) {
  try {
    // Creating new user
    const newUser = await createUser(req.body);
    logger.info(`New user(${newUser.email}) is created.`);
    // JSON response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    logger.error(error);
    res.status(500).json({ success: false, message });
  }
}
