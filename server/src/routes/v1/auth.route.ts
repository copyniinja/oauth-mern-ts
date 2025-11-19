import { Router } from "express";
import { config } from "server/src/config";
import { AuthController } from "server/src/controllers/v1";
import { generateToken, IUserPayload } from "server/src/lib/jwt.lib";
import { validateMiddleware } from "server/src/middlewares/validate.middleware";
import { registerToken } from "server/src/services/token.service";
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
  async (req, res, next) => {
    try {
      // No user? Reject.
      if (!req.user) {
        return res
          .status(400)
          .json({ success: false, message: "Login failed" });
      }

      const payload: IUserPayload = {
        email: req.user.email,
        role: req.user.role,
        userId: req.user._id,
      };

      // Token generation
      const accessToken = generateToken(payload, "ACCESS");
      const refreshToken = generateToken(payload, "REFRESH");

      // Save refresh token in DB
      await registerToken(req.user._id, refreshToken);

      // Set refresh token in HTTP-only cookie
      res.cookie("refresh", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 24 * 2,
      });

      // TODO:FIX it
      return res.redirect(
        `http://localhost:5173/auth/success?accessToken=${accessToken}`
      );
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route GET /api/v1/auth/refresh
 * @description Refresh Access token
 * @access Public
 */
router.get("/refresh", AuthController.renewAccessToken);
export default router;

router.get("/me", AuthController.getUserProfile);
