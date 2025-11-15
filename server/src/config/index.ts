import dotenv from "dotenv";
dotenv.config();
export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
  MONGO_URI: process.env.MONGO_URI!,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") || [],
  ADMIN_LIST: process.env.ADMIN_LIST?.split(",") || [],
};
