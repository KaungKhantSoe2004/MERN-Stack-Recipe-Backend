import express, { Router, Request, Response } from "express";
import UserController from "../controllers/user";
const userRouter: Router = express.Router();
userRouter.post("/register", (req: Request, res: Response) =>
  UserController.register(req, res)
);
userRouter.post("/login", (req: Request, res: Response) =>
  UserController.login(req, res)
);
export default userRouter;
