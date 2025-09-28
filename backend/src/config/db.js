import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URL);
    console.log("MongoDB connected successfully:", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};
