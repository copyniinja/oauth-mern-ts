import { NextFunction, Request, Response } from "express";
import z, { ZodError, ZodObject } from "zod";
export function validateMiddleware(schema: ZodObject) {
  return function (req: Request, res: Response, next: NextFunction) {
    // Validate request body,parmas and query according to given schema
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      // Send to next middleware
      next();

      // If error occurred
    } catch (error) {
      //Check if the error is a zod validation error
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: z.flattenError(error),
        });
      }
      next(error);
    }
  };
}
