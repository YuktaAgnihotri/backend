import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import express from "express"
const app = express();

export const connectDB = async ()=>{
     try{
        const connectInstance =   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongoose is connected at host : ${connectInstance.connection.host}`);
        app.on("error" , (err)=>{    // in case mongoose is uploaded but express is unable to load 
        console.log("error is", err);
        throw err;
    })
     }catch(error){
        console.log("mogoDB connection failed",error)
     }
} 




