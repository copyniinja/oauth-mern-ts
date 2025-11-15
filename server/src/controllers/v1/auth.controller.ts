import { Request, Response } from "express";
import logger from "server/src/lib/winston.lib";
import { createUser } from "server/src/services/user.service";

/**
 * Handles user login process
 * - Generate and returns authentication token
 * @param req Request object containing login credential in body
 * @param res Response object
 * @returns JSON response with user id and token
 * @throws 500 Internal server error for database or token failure
 */
export async function login() {}

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
