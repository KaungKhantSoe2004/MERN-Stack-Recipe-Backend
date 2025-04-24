import express, { Router, Request, Response } from "express";
import UserController from "../controllers/user";
import verifyToken from "../helpers/verifyToken";
const userRouter: Router = express.Router();
userRouter.post("/register", (req: Request, res: Response) =>
  UserController.register(req, res)
);
userRouter.post("/login", (req: Request, res: Response) =>
  UserController.login(req, res)
);
userRouter.get("/me", verifyToken, (req: Request, res: Response) =>
  UserController.me(req, res)
);
userRouter.get("/logout", verifyToken, (req: Request, res: Response) =>
  UserController.logout(req, res)
);
export default userRouter;
