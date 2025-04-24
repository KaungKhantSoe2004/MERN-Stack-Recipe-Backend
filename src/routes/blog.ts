import express, { Router, Request, Response, NextFunction } from "express";
import BlogController from "../controllers/blog";

import { uploadSingle } from "../helpers/upload";
import verifyToken from "../helpers/verifyToken";
const router: Router = express.Router();

// Correct usage of uploadSingle (it's already a middleware function)
router.post(
  "/addRecipe",
  verifyToken,
  uploadSingle("coverImage"),
  (req: Request, res: Response) => BlogController.addBlog(req, res)
);
// Other routes remain the same
router.get("/getRecipe", verifyToken, (req: Request, res: Response) =>
  BlogController.index(req, res)
);
router.delete("/deleteRecipe/:id", verifyToken, (req: Request, res: Response) =>
  BlogController.destoryBlog(req, res)
);
router.patch(
  "/updateRecipe/:id",
  verifyToken,
  uploadSingle("coverImage"),
  (req: Request, res: Response) => BlogController.updateBlog(req, res)
);

export default router;
