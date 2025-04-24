import express, { Router, Request, Response } from "express";
import BlogController from "../controllers/blog";

import { uploadSingle } from "../helpers/upload";
const router: Router = express.Router();

// Correct usage of uploadSingle (it's already a middleware function)
router.post(
  "/addRecipe",
  uploadSingle("coverImage"),
  (req: Request, res: Response) => BlogController.addBlog(req, res)
);
// Other routes remain the same
router.get("/getRecipe", (req: Request, res: Response) =>
  BlogController.index(req, res)
);
router.delete("/deleteRecipe/:id", (req: Request, res: Response) =>
  BlogController.destoryBlog(req, res)
);
router.patch(
  "/updateRecipe/:id",
  uploadSingle("coverImage"),
  (req: Request, res: Response) => BlogController.updateBlog(req, res)
);

export default router;
