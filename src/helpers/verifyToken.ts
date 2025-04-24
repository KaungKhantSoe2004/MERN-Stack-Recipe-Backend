import { verify } from "crypto";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { number } from "yup";
const jwt = require("jsonwebtoken");

// Extend Express Request to include `user`
const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  const token: string | undefined = req.cookies.jwt;
  console.log(token, "is token");
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err: string, decodedValue: any) => {
        if (err) {
          return res.status(401).json({
            message: "unauthorized ahah",
          });
        } else {
          const id = decodedValue.id;

          (req as any).user_id = id;
          next();
        }
      }
    );
  } else {
    return res.status(401).json({
      message: "no token exist",
    });
  }
};
export default verifyToken;
