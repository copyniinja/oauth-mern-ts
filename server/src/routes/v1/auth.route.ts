import { Router } from "express";
import { AuthController } from "server/src/controllers/v1";
import { validateMiddleware } from "server/src/middlewares/validate.middleware";
import { registerUserSchema } from "server/src/validators/user.validator";

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

export default router;
