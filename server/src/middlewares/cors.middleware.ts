import cors, { type CorsOptions } from "cors";
import { config } from "../config";
import logger from "../lib/winston.lib";

/*
CORS (Cross-Origin Resource Sharing) controls which origins are allowed to access server resources from the browser.
*/

// Configure cors options
const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    const allowedOrigins = config.ALLOWED_ORIGINS;
    /*
     * !requestOrigin : Many valid request doesnt include origin like ( server to server ,postman)
     * in development: Allow all access
     *  request origin is in the allowed list
     */
    if (
      !requestOrigin ||
      config.NODE_ENV === "development" ||
      allowedOrigins.includes(requestOrigin)
    ) {
      callback(null, true); // Allow access
    } else {
      logger.warn(`CORS Error: ${requestOrigin} is not allowed by CORS.`);
      // Block access
      callback(
        new Error(`CORS Error: ${requestOrigin} is not allowed by CORS.`),
        false
      );
    }
  },
  credentials: true,
};

// Handle cors
export function corsMiddleware() {
  return cors(corsOptions);
}
