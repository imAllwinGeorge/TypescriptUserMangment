import mongoose from "mongoose";


export async function connectDB(){
    await mongoose.connect("mongodb://localhost:27017/reactTypescript")
    .then(()=>{
        console.log("mongodb connected successfull")
    })
    .catch(err=>{
        console.log("mongodb connection error",err)
    })
}