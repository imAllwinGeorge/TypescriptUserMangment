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
exports.adminLogout = exports.verifyAdmin = exports.addUser = exports.toggleUser = exports.editUser = exports.home = exports.adminLogin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltRound = Number(process.env.SALTROUND);
const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "invalid credentials" });
            return;
        }
        if (!user.isAdmin) {
            res.status(400).json({ message: "Unauthorized access" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "invalid credentials" });
            return;
        }
        const adminAccessToken = jsonwebtoken_1.default.sign({ id: user._id }, accessSecret, {
            expiresIn: "15m",
        });
        const adminRefreshToken = jsonwebtoken_1.default.sign({ id: user._id }, refreshSecret, {
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
    }
    catch (error) {
        console.log("admin login errot", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.adminLogin = adminLogin;
const home = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        res.status(200).json({ user, message: "userdetails fetched" });
    }
    catch (error) {
        console.log("admin home fetch error", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.home = home;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, firstName, lastName, email, phone } = req.body;
        const user = yield userModel_1.default.findByIdAndUpdate(userId, { firstName, lastName, email, phone }, { new: true });
        res.status(200).json({ message: "user data updated" });
    }
    catch (error) {
        console.log("admin edit user error", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.editUser = editUser;
const toggleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield userModel_1.default.findByIdAndUpdate(userId, [{ $set: { isBlocked: { $not: "$isBlocked" } } }], { new: true });
        if (user) {
            res.status(200).json({ message: "user status changed" });
            return;
        }
        res.status(404).json({ message: "user not found " });
    }
    catch (error) {
        console.log("toggle user error", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.toggleUser = toggleUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        const isExist = yield userModel_1.default.findOne({ email });
        if (!isExist) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, saltRound);
            const user = new userModel_1.default({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
            });
            yield user.save();
            res.status(201).json({ message: "user created" });
            return;
        }
        res.status(404).json({ message: "user already exist" });
    }
    catch (error) {
        console.log("admin add user error", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.addUser = addUser;
const verifyAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminAuthorization = req.headers["admin-authorization"];
        let token = Array.isArray(adminAuthorization)
            ? adminAuthorization[0] // Take the first element if it's an array
            : adminAuthorization; // Otherwise, use it as is
        if (!token || !token.startsWith("Bearer ")) {
            const { adminRefreshToken } = req.cookies;
            if (adminRefreshToken) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(adminRefreshToken, refreshSecret);
                    const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, accessSecret, {
                        expiresIn: "15m",
                    });
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
        // Otherwise, use it as is
        token = token.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, accessSecret);
        const user = yield userModel_1.default.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user === null || user === void 0 ? void 0 : user.isBlocked) {
            res
                .status(401)
                .json({ message: "please contact admin you have been blocked" });
            return;
        }
        res.status(200).json({ message: "verified user" });
    }
    catch (error) {
        console.log("verify user error", error);
        res.status(500).json({ message: "internal server" });
    }
});
exports.verifyAdmin = verifyAdmin;
const adminLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("adminRefreshToken", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 0,
        });
        res.status(200).json({ message: "user logout" });
    }
    catch (error) {
        console.log("admin logout error", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.adminLogout = adminLogout;
