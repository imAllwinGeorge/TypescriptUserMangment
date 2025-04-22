import express from "express";
import { addUser, adminLogin, adminLogout, editUser, home, toggleUser, verifyAdmin } from "../controllers/adminController";
const route = express.Router();


route.post("/login",adminLogin);

route.get("/home",home);

route.post("/edit-user",editUser);

route.post("/toggle-user",toggleUser)

route.post("/add-user",addUser)

route.get("/verify-admin",verifyAdmin)

route.get("/logout",adminLogout);


export default route