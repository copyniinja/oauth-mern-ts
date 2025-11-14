import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { morganMiddleware } from "./middlewares/morgan.middleware";
import { rateLimitMiddleware } from "./middlewares/ratelimit.middleware";

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

// Routes

export default app;
