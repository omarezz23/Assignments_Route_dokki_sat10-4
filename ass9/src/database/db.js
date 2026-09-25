import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { DB_NAME, DB_URI, PORT } from "../config/index.js";
import { UserModel } from "./models/user.model.js";

//dotenv.config();
const app = express();
app.use(cors(), express.json());

export const connectDB = async (app, PORT) => {
  try {
    await mongoose.connect(DB_URI, { dbName: DB_NAME });
    UserModel.syncIndexes(); 
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};
export { app, PORT };
