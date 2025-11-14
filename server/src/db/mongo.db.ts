import mongoose from "mongoose";
import { config } from "../config";
import logger from "../lib/winston.lib";

// Handle mongodb connection
export async function connectMongodb() {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("Mongodb connected");
  } catch (error) {
    const message =
      error instanceof Error
        ? "Failed to connect Mongodb:" + error.message
        : "Failed to connect mongodb.";
    logger.error(message);
    process.exit(1);
  }
}

// Handle mongodb disconnection
export async function disconnectMongodb() {
  try {
    await mongoose.disconnect();
    logger.info("Mongodb disconnected.");
  } catch (error) {
    const message =
      error instanceof Error
        ? "Failed to disconnect Mongodb:" + error.message
        : "Failed to disconnect mongodb.";
    logger.error(message);
  }
}
