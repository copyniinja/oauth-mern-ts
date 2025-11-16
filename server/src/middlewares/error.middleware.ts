import { NextFunction, Request, Response } from "express";
import logger from "../lib/winston.lib";

export function errorMiddleware() {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err instanceof Error ? err.message : err);

    // Mongoose bad ObjectId (CastError)
    if (err?.name === "CastError" && err.kind === "ObjectId") {
      err.status = 404;
      err.message = "Resource not found";
    }

    // Default values
    const status = err.status || 500;
    const message = err.message || "Internal server error";

    // Final JSON response
    return res.status(status).json({
      success: false,
      status,
      message,
    });
  };
}
