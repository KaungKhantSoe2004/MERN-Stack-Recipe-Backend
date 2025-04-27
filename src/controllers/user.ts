const bcrypt = require("bcryptjs");
import { Request, Response } from "express";
import User from "../models/User";
import getToken from "../helpers/jwt";

const UserController = {
  register: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(422).json({
          success: false,
          message: "error occured",
          errors: "credentials required",
        });
        return;
      }

      const ExistedUser = await User.findOne({ email: email });

      if (ExistedUser) {
        return res.status(409).json({
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
        const token = getToken(newUser._id);
        res.cookie("jwt", token, {
          httpOnly: true,

          maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
          success: true,
          message: "Success",
        });
      }
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "error occured",
        errors: e,
      });
    }
  },
  login: async (req: Request, res: Response): Promise<any> => {
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
        const token = getToken(ExistedUser._id);
        res.cookie("jwt", token, {
          httpOnly: true,

          maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
          success: true,
          message: "Success",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Password icorrect",
          errors: "Password incorrect",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
        errors: "User doesn't exist",
      });
    }
  },
  me: async (req: Request | any, res: Response): Promise<void> => {
    const user = await User.findById(req.user_id);

    res.status(200).json({
      data: user,
      message: "success",
    });
  },
  logout: async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("jwt", {
      httpOnly: true,
    });
    res.status(200).json({ message: "logged out" });
  },
};
export default UserController;
