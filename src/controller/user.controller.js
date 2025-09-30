import { asyncHandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apiErrors.js";
import {User} from '../models/user.model.js'
import uploadImage from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req , res)=>{
   res.status(200).json({
      message : "hwlo donee"
   })

   const {fullName , email ,username , password} = req.body
   console.log(email,fullName)
   if(
      [fullName , email , username , password].some((field)=>
      field?.trim() === "")
   ){
      throw new Apierror(400, "one of the text field is empty")
   }
   const existedUser  = User.findOne({ //model created with mongoose so it has access to all fields
      $or : [{username} , {email}]
   })
   if (existedUser){
      throw new Apierror(409, "user already exists")
   }
   console.log(req.files?.avatar)
   const avatarLocalPath = req.files?.avatar[0].path;
    const coverImageLocalPath = req.files?.coverImage[0].path;

    if ( !avatarLocalPath) {
      throw new Apierror(400,"avatar is required")
    }
  const avatar = await uploadImage(avatarLocalPath)
  const coverImage = await uploadImage(coverImageLocalPath)

  if(!avatar){
   throw new Apierror(400,"avatar is required on cloudinary")
  }

   const user = await User.create({
   fullName,
   avatar : avatar.url,
   coverImage : coverImage?.url || "", //if coverImage is present uppload it otherwise keep it empty
   email ,
   password,
   username : username.tolowerCase(),

  })
  User.findById(user._id).select(
   "-password -refreshToken"  //This will delete password and refreshToken upon sending user object
  )
  if( !createUser ){
   throw new Apierror(500, "something went wrong with database creation for user")
  }
return res.status(201).json(
   new ApiResponse(200,createdUser,"userregistered successfully")
)



})

export {registerUser}