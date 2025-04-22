"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const route = express_1.default.Router();
route.post("/signup", userController_1.signUp);
route.post("/login", userController_1.login);
route.get("/user/:userid", userController_1.fetchUser);
route.post("/edit/:userId", userController_1.editUser);
route.get("/verify-user", userController_1.verifyUser);
route.get("/logout", userController_1.userLogout);
exports.default = route;
