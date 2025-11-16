import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import helmet from "helmet";
import passport from "./lib/passport.lib";
import { authenticateMiddleware } from "./middlewares/authenticate.middleware";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { morganMiddleware } from "./middlewares/morgan.middleware";
import { notFoundMiddleware } from "./middlewares/notfound.middleware";
import { rateLimitMiddleware } from "./middlewares/ratelimit.middleware";
import v1Routes from "./routes/v1";

// Initiate express app
const app = express();

// Middlewares
app.use(morganMiddleware("short"));
app.use(corsMiddleware());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ threshold: 1024 }));
app.use(rateLimitMiddleware());
app.use(passport.initialize());

// Routes
app.use("/api/v1", v1Routes);

/*
// Private routes (TODO: Delete it)--------
*/
app.get(
  "/api/v1/profile",
  authenticateMiddleware,
  (req: Request, res: Response) => {
    res.json({ userId: req.userId });
  }
);
/* 
--------------------------------------------
*/

// Not Found middleware
app.use(notFoundMiddleware());
// Error middleware
app.use(errorMiddleware());

export default app;
