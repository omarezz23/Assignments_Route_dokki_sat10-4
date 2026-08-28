import { MongoClient } from "mongodb";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(cors(), express.json());

export const client = new MongoClient(process.env.DB_URI, {
  serverSelectionTimeoutMS: 3000,
});

// export let db;

export const connectDB = async (app, port) => {
  try {
    await client.connect();

    //db = client.db("booksDB");

    console.log("MongoDB connected successfully");

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    return server;
  } catch (error) {
    console.log("MongoDB connection failed:", error);
  }
};
export const db = client.db("booksDB")
export { app, port };
