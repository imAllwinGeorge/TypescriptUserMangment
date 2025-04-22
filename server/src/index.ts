import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/userRoutes"
import adminRoutes from "./routes/adminRoutes"
import { connectDB } from './config/connectDB';
import cookieParser from 'cookie-parser';


const app = express();





app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))




app.use("/",userRoutes)
app.use("/admin",adminRoutes)


connectDB();
app.listen(3000,()=>
console.log("server running successfully"))