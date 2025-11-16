import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import passport from "passport";
import { config } from "server/src/config";
import { compareHashString } from "server/src/lib/bcrypt.lib";
import { generateToken, verifyToken } from "server/src/lib/jwt.lib";
import logger from "server/src/lib/winston.lib";
import { IUser } from "server/src/models/user.model";
import {
  getTokenByUserId,
  registerToken,
} from "server/src/services/token.service";
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
    async (
      err: any,
      user:
        | (Omit<IUser, "password"> & { _id: mongoose.Types.ObjectId })
        | false,
      info: { message: string }
    ) => {
      try {
        if (err) return next(err);
        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: info?.message });
        }
        // Generate access and refresh token
        const accessToken = generateToken(
          { userId: user._id, email: user.email, role: user.role },
          "ACCESS"
        );
        const refreshToken = generateToken(
          { userId: user._id, email: user.email, role: user.role },
          "REFRESH"
        );
        // Save refresh token in database
        await registerToken(user._id, refreshToken);

        // Set http only cookie
        res.cookie("refresh", refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 2,
          secure: process.env.NODE_ENV === "production",
        });

        // Response
        res.status(200).json({ user, accessToken });
      } catch (error) {
        logger.error(error);
        next(error);
      }
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

/**
 * Generate new access token
 * - use refresh token in cookie to generate new access token
 * @param req Request object containing user info in body
 * @param res Response object
 * @returns 200 success JSON response with access token
 * @throws 500 Internal server error for database
 */
export async function renewAccessToken(req: Request, res: Response) {
  try {
    // Check if refresh token exists in cookie
    const refreshToken = req.cookies.refresh;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }
    // Verify refresh token
    const payload = verifyToken(refreshToken, "REFRESH");

    // Get saved token
    const savedToken = await getTokenByUserId(payload.userId);

    if (!savedToken) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Compare saved token with cookie token
    const isValid = await compareHashString(refreshToken, savedToken.token);
    if (!isValid) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }
    // Check expiry
    if (savedToken.expiresAt < new Date()) {
      return res
        .status(403)
        .json({ success: false, message: "Refresh token expired" });
    }
    const { exp, iat, ...safePayload } = payload;
    // Rotate refresh token
    const newRefreshToken = generateToken(safePayload, "REFRESH");
    // Save refresh token in database
    const newSavedToken = await registerToken(
      safePayload.userId,
      newRefreshToken
    );
    if (!newSavedToken) {
      logger.error("Failed to save token in database");
      return res
        .status(500)
        .json({ success: false, message: "Failed to save token in database" });
    }
    // Set cookie
    res.cookie("refresh", newRefreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 2,
    });

    // Generate new access token
    const newAccessToken = generateToken(payload, "ACCESS");
    res.json({ success: true, accessToken: newAccessToken });
  } catch (error: any) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    logger.error(message);
    const status = error.status || 500;
    res.status(status).json({ success: false, message });
  }
}
