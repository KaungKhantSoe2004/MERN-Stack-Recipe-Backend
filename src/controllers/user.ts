const bcrypt = require("bcryptjs");
import { Request, Response } from "express";
import User from "../models/User";

const UserController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        console.log("ok desu");
        res.status(422).json({
          success: false,
          message: "error occured",
          errors: "credentials required",
        });
        return;
      }

      const ExistedUser = await User.findOne({ email: email });
      console.log(ExistedUser);
      if (ExistedUser) {
        res.status(409).json({
          success: false,
          message: "User already Exists",
          errors: "User already Exists",
        });
        return;
      }
      const salt = bcrypt.genSaltSync(10);

      if (password) {
        const hashedPassword = bcrypt.hashSync(password, salt);
        req.body.password = hashedPassword;
      }
      const newUser = await new User(req.body).save();
      if (newUser) {
        res.status(200).json({
          success: true,
          message: "Success",
        });
      }
    } catch (e) {
      console.log(e, "is error");
      res.status(400).json({
        success: false,
        message: "error occured",
        errors: e,
      });
    }
  },
  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(422).json({
        success: true,
        message: "Email or Password is required",
      });
      return;
    }
    const ExistedUser = await User.findOne({ email: email });
    if (ExistedUser) {
      const hashedPassword = ExistedUser.password;
      const isPasswordTrue = bcrypt.compareSync(password, hashedPassword);
      if (isPasswordTrue) {
        res.status(200).json({
          success: true,
          message: "Success",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Password icorrect",
          errors: "Password incorrect",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User doesn't exist",
        errors: "User doesn't exist",
      });
    }
  },
};
export default UserController;
