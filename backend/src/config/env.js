import dotenv from "dotenv";

export const ENV = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV,
};
