import { Request, Response } from "express"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import UserModel from "../models/userModel";
import dotenv from 'dotenv';

dotenv.config();

const saltRound = Number(process.env.SALTROUND)
const accessSecret = process.env.ACCESS_SECRET as string
const refreshSecret = process.env.REFRESH_SECRET as string



export const signUp = async (req: Request,res: Response): Promise<void> =>  {
    try {
        const {firstName,lastName,email,password,phone} = req.body

        const isExist = await UserModel.findOne({email});
        if(!isExist){

            const hashedPassword = await bcrypt.hash(password,saltRound)
            const user = new UserModel({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone
            })
    
            await user.save();

            console.log(user)

            const accessToken = jwt.sign({id: user._id},accessSecret,{expiresIn:"15m"});
            const refreshToken = jwt.sign({id:user._id},refreshSecret,{expiresIn:"1h"})

            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 15 minutes in milliseconds
              })


            res.status(201).json({message: "user created successfull",accessToken,user});
            return
        }

        res.status(404).json({message: "user already exist"})
        
    } catch (error) {
        console.log("user signup",error)
        res.status(500).json({message: "internal server error"})
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        console.log(1)
        const {email, password} = req.body
        console.log(2)
        const user = await UserModel.findOne({email});
        console.log(3)
        if(!user){
            res.status(404).json({message:"user not found"})
            return
        }

        if(user.isBlocked){
            res.status(404).json({message: "you have been blocked, please contact admin"});
            return
        }
        console.log(4)
        const isMatch = await bcrypt.compare(password,user.password);
        console.log(5)
        if(isMatch){
            const accessToken = jwt.sign({id:user._id},accessSecret,{expiresIn:'15m'});
            const refreshToken = jwt.sign({id:user._id},refreshSecret,{expiresIn:"1h"})

            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 15 minutes in milliseconds
              })
            console.log(accessToken)
            res.status(200).json({message:"user login success",accessToken,user})
            console.log(6)
            return
        }
        res.status(401).json({ message: "Invalid credentials" });

    } catch (error) {
        console.log("user controller signup error",error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const fetchUser = async (req: Request, res: Response) => {
    try {
        const {userid} = req.params

        const user = await UserModel.findById(userid)

        if(!user){
            res.status(404).json({message: 'user not found'})
            return
        }

        res.status(200).json({message: "user data fetched",user})
        
    } catch (error) {
        console.log("fetch user", error);
        res.status(500).json({message: "internal sever error"})
    }
}

export const editUser = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params;
        const {firstName, lastName, email, phone} = req.body

        const user = await UserModel.findByIdAndUpdate(userId,{firstName, lastName, email, phone},{new: true});

        res.status(200).json({message: "user Udated success full",user});

        
    } catch (error) {
        console.log("edit user",error)
        res.status(500).json({message: "internal server error"});
    }
}

export const verifyUser = async ( req: Request, res: Response) => {
    try {
        const {authorization} = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            console.log(req.cookies)
            const {refreshToken} = req.cookies
            if(refreshToken){
                try {
                    const decoded = jwt.verify(refreshToken, refreshSecret) as { id: string };
                    const newAccessToken = jwt.sign({ id: decoded.id }, accessSecret, { expiresIn: "15m" });
          
                    res.json({ accessToken: newAccessToken }); // ✅ Stop execution here
                    return
                  } catch (error) {
                    res.status(403).json({ message: "Invalid refresh token" });
                    return
                  }
            }
                res.status(401).json({ message: "No token provided" });
                return
        }

        const token = authorization.split(" ")[1]; 

        const decoded = jwt.verify(token,accessSecret) as {id: string}
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
          }

        if(user?.isBlocked){
           res.status(401).json({message: "please contact admin you have been blocked"})
           return
        }

        res.status(200).json({message: "verified user"})

    } catch (error) {
        console.log("verify user error", error)
        res.status(500).json({message: "internal server"})
    }
};

export const userLogout = async (req: Request, res: Response) => {
    try {
        res.cookie("refreshToken","",{
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 0
          })

          res.status(200).json({message: "user logout"})
    } catch (error) {
        console.log("user logout error", error);
        res.status(500).json({message: "internal server"})
    }
}