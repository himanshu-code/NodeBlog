import express from "express";
import type { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";

dotenv.config();

const app: Application = express();
const frontendDistDir = path.join(__dirname, "..", "frontend", "dist");
const frontendIndexFile = path.join(frontendDistDir, "index.html");

app.use(express.json());

if (fs.existsSync(frontendDistDir)) {
  app.use(express.static(frontendDistDir));
}

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get(/.*/, (_req, res) => {
  if (fs.existsSync(frontendIndexFile)) {
    return res.sendFile(frontendIndexFile);
  }

  return res.status(200).json({
    message: "Frontend build not found. Run `npm install && npm run build` in frontend/.",
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
