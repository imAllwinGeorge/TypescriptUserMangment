import { Request, response, Response } from "express";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const saltRound = Number(process.env.SALTROUND);
const accessSecret = process.env.ACCESS_SECRET as string;
const refreshSecret = process.env.REFRESH_SECRET as string;

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "invalid credentials" });
      return;
    }

    if (!user.isAdmin) {
      res.status(400).json({ message: "Unauthorized access" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "invalid credentials" });
      return;
    }

    const adminAccessToken = jwt.sign({ id: user._id }, accessSecret, {
      expiresIn: "15m",
    });
    const adminRefreshToken = jwt.sign({ id: user._id }, refreshSecret, {
      expiresIn: "1h",
    });

    res.cookie("adminRefreshToken", adminRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 15 minutes in milliseconds
    });
    res
      .status(200)
      .json({
        message: "admin logged in",
        user,
        accessToken: adminAccessToken,
      });
  } catch (error) {
    console.log("admin login errot", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const home = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.find();

    res.status(200).json({ user, message: "userdetails fetched" });
  } catch (error) {
    console.log("admin home fetch error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { userId, firstName, lastName, email, phone } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, phone },
      { new: true }
    );

    res.status(200).json({ message: "user data updated" });
  } catch (error) {
    console.log("admin edit user error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const toggleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      [{ $set: { isBlocked: { $not: "$isBlocked" } } }],
      { new: true }
    );
    if (user) {
      res.status(200).json({ message: "user status changed" });
      return;
    }
    res.status(404).json({ message: "user not found " });
  } catch (error) {
    console.log("toggle user error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const isExist = await UserModel.findOne({ email });
    if (!isExist) {
      const hashedPassword = await bcrypt.hash(password, saltRound);
      const user = new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
      });

      await user.save();
      res.status(201).json({ message: "user created" });
      return;
    }
    res.status(404).json({ message: "user already exist" });
  } catch (error) {
    console.log("admin add user error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const verifyAdmin = async (req: Request, res: Response) => {
  try {
    const adminAuthorization = req.headers["admin-authorization"];
    let token = Array.isArray(adminAuthorization)
      ? adminAuthorization[0] // Take the first element if it's an array
      : adminAuthorization; // Otherwise, use it as is

    if (!token || !token.startsWith("Bearer ")) {
      const { adminRefreshToken } = req.cookies;
      if (adminRefreshToken) {
        try {
          const decoded = jwt.verify(adminRefreshToken, refreshSecret) as {
            id: string;
          };
          const newAccessToken = jwt.sign({ id: decoded.id }, accessSecret, {
            expiresIn: "15m",
          });

          res.json({ accessToken: newAccessToken }); // ✅ Stop execution here
          return;
        } catch (error) {
          res.status(403).json({ message: "Invalid refresh token" });
          return;
        }
      }
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // Otherwise, use it as is

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, accessSecret) as { id: string };
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user?.isBlocked) {
      res
        .status(401)
        .json({ message: "please contact admin you have been blocked" });
      return;
    }

    res.status(200).json({ message: "verified user" });
  } catch (error) {
    console.log("verify user error", error);
    res.status(500).json({ message: "internal server" });
  }
};

export const adminLogout = async (req: Request, res: Response) => {
  try {
    res.cookie("adminRefreshToken","",{
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0,
    })
    res.status(200).json({message: "user logout"})
  } catch (error) {
    console.log("admin logout error",error);
    res.status(500).json({message: "internal server error"})
  }
}
