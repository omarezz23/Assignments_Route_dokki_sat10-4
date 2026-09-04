import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors(), express.json());

const port = process.env.PORT;
const mongoUrl = process.env.DB_URI;
const DB_NAME = "ass7DB";
// MongoDB connection
export const connectDB = async (app, port) => {
  try {
    await mongoose.connect(mongoUrl, { dbName: DB_NAME });
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};
export { app, port };
