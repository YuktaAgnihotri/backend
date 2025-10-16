import { Apierror } from '../utils/apiErrors.js'
import {asyncHandler} from '../utils/asynchandler.js'
import jwt from "jsonwebtoken"
import { User } from '../models/user.model.js'


export const verifyJWT = async(req , res ,next)=>{

try {
 
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" ,"") //user might be sending customer header 
    if(!token) {                                                    //we get Authorization Bearer <token> .replace removes unneccssary "bearer "
    throw new Apierror(401 , "unauthorized request")
   }

    const decodeToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    const user =   await User.findById(decodeToken._id).select("-password -refreshToken")
   
    if(!user) {
    throw new Apierror(401 , "Invalid accessTOken")
   }
   req.user = user;  // add the decoded user to the object
   next();
   

} catch (error) {
    throw new Apierror(400 , "Invalid or expired token ")
    //res.status(400).json({ message: error.message});
  
}
 


}