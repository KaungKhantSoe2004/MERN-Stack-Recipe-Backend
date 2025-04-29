import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/blog";
import multer from "multer";
import userRouter from "./routes/user";
import sendMail from "./helpers/sendMail";
import emailQueue from "./helpers/emailQueue";

emailQueue.process(async (job: any, done: any) => {
  try {
    // console.log(job.data.user, "in blog index.ts");
    // console.log(job.data.allUsers, "in index");
    // console.log(job.data.newBlog, "in index");
    sendMail(job.data.allUsers, job.data.user, job.data.newBlog);
  } catch (err) {
    console.log("error in sending email");
  }
});
dotenv.config();
const cookieParser = require("cookie-parser");
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
// app.use(cors());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 must match your frontend's origin
    credentials: true, // 👈 allow cookies and credentials
  })
);
app.use(express.json());
app.use(express.static("public"));
// app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");
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
