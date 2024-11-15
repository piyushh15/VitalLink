import "dotenv/config";
import express from "express";
import connectDB from "./db/index.js"; // Database connection logic
import { app } from "./app.js"; // Express app logic

connectDB()
  .then(() => {
    app.listen(() => {
      console.log("⚙️ Server is running on Vercel");
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed!!", err);
});