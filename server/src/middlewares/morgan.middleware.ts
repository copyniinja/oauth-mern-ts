import morgan from "morgan";
import logger from "../lib/winston.lib";
// Types
type Format = "combined" | "common" | "dev" | "short" | "tiny";

// Morgan http logger middleware
// Pipe morgan http logs into winston logger
export function morganMiddleware(format: Format) {
  return morgan(format, {
    stream: {
      write(str) {
        return logger.http(str);
      },
    },
  });
}
