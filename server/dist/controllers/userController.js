"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.verifyUser = exports.editUser = exports.fetchUser = exports.login = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltRound = Number(process.env.SALTROUND);
const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        const isExist = yield userModel_1.default.findOne({ email });
        if (!isExist) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, saltRound);
            const user = new userModel_1.default({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone
            });
            yield user.save();
            console.log(user);
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, accessSecret, { expiresIn: "15m" });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, refreshSecret, { expiresIn: "1h" });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 15 minutes in milliseconds
            });
            res.status(201).json({ message: "user created successfull", accessToken, user });
            return;
        }
        res.status(404).json({ message: "user already exist" });
    }
    catch (error) {
        console.log("user signup", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(1);
        const { email, password } = req.body;
        console.log(2);
        const user = yield userModel_1.default.findOne({ email });
        console.log(3);
        if (!user) {
            res.status(404).json({ message: "user not found" });
            return;
        }
        if (user.isBlocked) {
            res.status(404).json({ message: "you have been blocked, please contact admin" });
            return;
        }
        console.log(4);
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        console.log(5);
        if (isMatch) {
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, accessSecret, { expiresIn: '15m' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, refreshSecret, { expiresIn: "1h" });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 15 minutes in milliseconds
            });
            console.log(accessToken);
            res.status(200).json({ message: "user login success", accessToken, user });
            console.log(6);
            return;
        }
        res.status(401).json({ message: "Invalid credentials" });
    }
    catch (error) {
        console.log("user controller signup error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userid } = req.params;
        const user = yield userModel_1.default.findById(userid);
        if (!user) {
            res.status(404).json({ message: 'user not found' });
            return;
        }
        res.status(200).json({ message: "user data fetched", user });
    }
    catch (error) {
        console.log("fetch user", error);
        res.status(500).json({ message: "internal sever error" });
    }
});
exports.fetchUser = fetchUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { firstName, lastName, email, phone } = req.body;
        const user = yield userModel_1.default.findByIdAndUpdate(userId, { firstName, lastName, email, phone }, { new: true });
        res.status(200).json({ message: "user Udated success full", user });
    }
    catch (error) {
        console.log("edit user", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.editUser = editUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            console.log(req.cookies);
            const { refreshToken } = req.cookies;
            if (refreshToken) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
                    const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, accessSecret, { expiresIn: "15m" });
                    res.json({ accessToken: newAccessToken }); // ✅ Stop execution here
                    return;
                }
                catch (error) {
                    res.status(403).json({ message: "Invalid refresh token" });
                    return;
                }
            }
            res.status(401).json({ message: "No token provided" });
            return;
        }
        const token = authorization.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, accessSecret);
        const user = yield userModel_1.default.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user === null || user === void 0 ? void 0 : user.isBlocked) {
            res.status(401).json({ message: "please contact admin you have been blocked" });
            return;
        }
        res.status(200).json({ message: "verified user" });
    }
    catch (error) {
        console.log("verify user error", error);
        res.status(500).json({ message: "internal server" });
    }
});
exports.verifyUser = verifyUser;
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 0
        });
        res.status(200).json({ message: "user logout" });
    }
    catch (error) {
        console.log("user logout error", error);
        res.status(500).json({ message: "internal server" });
    }
});
exports.userLogout = userLogout;
