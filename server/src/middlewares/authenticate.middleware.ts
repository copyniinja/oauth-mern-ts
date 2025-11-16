import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt.lib";

/**
 * Handle authentication
 * - Only logged in user can pass through
 * - Authenticate by bearer token
 * - Add authenticate user_id to req
 * @param req Request object
 * @param res Request object
 * @param next Next function
 * @returns response with error if user not authenticate
 * @throws 401 If user has no token in authorization header
 */
export async function authenticateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  try {
    // Check authorization header exists
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }
    // Must start with Bearer
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid authorization format" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    // Verify token
    const payload = verifyToken(token, "ACCESS");
    req.userId = payload.userId;
    req.role = payload.role;
    next();
  } catch (error) {
    // Send error to  error middleware
    next(error);
  }
}
