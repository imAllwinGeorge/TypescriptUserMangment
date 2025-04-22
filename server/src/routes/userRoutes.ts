import express  from 'express';
import { editUser, fetchUser, login, signUp, userLogout, verifyUser } from '../controllers/userController';


const route = express.Router();


route.post("/signup",signUp)

route.post("/login",login)

route.get("/user/:userid",fetchUser)

route.post("/edit/:userId",editUser)

route.get("/verify-user",verifyUser)

route.get("/logout",userLogout)


export default route 