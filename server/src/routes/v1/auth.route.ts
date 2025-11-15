import { Router } from "express";
import { AuthController } from "server/src/controllers/v1";
import { generateToken, IUserPayload } from "server/src/lib/jwt.lib";
import { validateMiddleware } from "server/src/middlewares/validate.middleware";
import { registerUserSchema } from "server/src/validators/user.validator";
import passport from "./../../lib/passport.lib";

const router = Router();

/**
 * @route POST /api/v1/auth/login
 * @description Credential login route
 * @access Public
 */
router.post("/login", AuthController.login);

/**
 * @route POST /api/v1/auth/register
 * @description Register a new user account
 * Validates the user input against the schema
 * Creates new user
 * @access Public
 */
router.post(
  "/register",
  validateMiddleware(registerUserSchema),
  AuthController.register
);

/**
 * @route POST /api/v1/auth/google
 * @description Oauth google login
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route POST /api/v1/auth/redirect
 * @description Oauth google login redirect
 * @access Public
 */
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Failed to login
    if (!req.user) {
      return res.status(400).json({ success: false, message: "Login failed" });
    }
    const payload: IUserPayload = {
      email: req.user.email,
      role: req.user.role,
      userId: req.user._id,
    };
    // Generate tokens
    const accessToken = generateToken(payload, "ACCESS");
    const refreshToken = generateToken(payload, "REFRESH");
    // Set refresh token inside http only cookie
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      maxAge: 3600 * 24 * 2,
    });

    res.json({ success: true, accessToken, message: "Logged In" });
  }
);
export default router;
