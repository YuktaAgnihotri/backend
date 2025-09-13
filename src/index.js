import dotenv from "dotenv"
import mongoose from "mongoose"
import { connectDB } from "./db/index.js";



dotenv.config({path: './env'});
connectDB()

//takes time to load database so use async await ans try catch for debugging
/*import express from "express"
import { DB_NAME } from "./constants";
const app  = express();
//() before async is iff statement it executes the file immediately 
 (async()=>{
    try{
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error" , (err)=>{    // in case mongoose is uploaded but express is unable to load 
        console.log("error is", err);
        throw err;
    })
    }catch{
        console.log(error)
    }
 })*/