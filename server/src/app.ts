import express from "express";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { morganMiddleware } from "./middlewares/morgan.middleware";

const app = express();

// Middlewares
app.use(morganMiddleware("short"));
app.use(corsMiddleware());

export default app;
