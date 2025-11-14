import http from "http";
import app from "./app";
import { config } from "./config";
import { connectMongodb, disconnectMongodb } from "./db/mongo.db";
import logger from "./lib/winston.lib";

let server: http.Server;
const FORCE_EXIT_TIME_IN_MILLISECONDS = 10000;

async function startServer() {
  try {
    // Connect to database
    await connectMongodb();

    server = http.createServer(app);
    server.listen(config.PORT, () => {
      logger.info(`Server is listening on port:${config.PORT}`);
    });

    // Listening to shut down signals
    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  } catch (error) {
    logger.error(`Failed to start server: %o`, error);
    process.exit(1);
  }
}

async function handleShutdown(signal: "SIGTERM" | "SIGINT") {
  logger.warn(`Received ${signal}.Starting graceful shutdown...`);

  // Force exit
  const forceExit = setTimeout(() => {
    logger.error("Force exiting after timeouts.");
    process.exit(1);
  }, FORCE_EXIT_TIME_IN_MILLISECONDS).unref();

  try {
    // Stop accepting new connection
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          logger.info("HTTP server closed.");
          resolve();
        });
      });
    }

    // Close database connection
    await disconnectMongodb();
    logger.info("Cleanup completed.Exiting process.");
    clearTimeout(forceExit); // cancelling fallback exit
    process.exit(0);
  } catch (error) {
    logger.error("Error during gracefully shutdown:", error);
    process.exit(1);
  }
}

// Starting the server
startServer();
