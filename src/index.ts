import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/blog";
import multer from "multer";
import userRouter from "./routes/user";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
// app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
// app.use(upload.single("image")); // Parse multipart/form-data

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});
app.use("/user", userRouter);
app.use("/blog", router);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
