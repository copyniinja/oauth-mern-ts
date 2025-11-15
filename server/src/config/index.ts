import dotenv from "dotenv";
dotenv.config();
export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
  MONGO_URI: process.env.MONGO_URI!,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") || [],
  ADMIN_LIST: process.env.ADMIN_LIST?.split(",") || [],
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "9beaf9c3dc9a0596612bf5dd57779be7",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "f040f4f6378a9c76ef19c04c551c2818",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  CALLBACK_URL: process.env.CALLBACK_URL!,
};
