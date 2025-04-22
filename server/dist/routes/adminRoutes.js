"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const route = express_1.default.Router();
route.post("/login", adminController_1.adminLogin);
route.get("/home", adminController_1.home);
route.post("/edit-user", adminController_1.editUser);
route.post("/toggle-user", adminController_1.toggleUser);
route.post("/add-user", adminController_1.addUser);
route.get("/verify-admin", adminController_1.verifyAdmin);
route.get("/logout", adminController_1.adminLogout);
exports.default = route;
