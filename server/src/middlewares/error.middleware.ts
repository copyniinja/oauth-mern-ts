import { NextFunction, Request, Response } from "express";
import logger from "../lib/winston.lib";
export function errorMiddleware() {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err instanceof Error ? err.message : err);

    if (err?.name === "CastError" && err.kind === "ObjectId") {
      err.status = 404;
      err.message = "Resource not found";
    }
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  };
}
