import {User} from "../models/user.model.js";   // your mongoose user schema
import uploadImage from "../utils/cloudinary.js"; // the upload function you wrote
import { Apierror } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const generateAccessRefreshToken = async (userId) =>{  //this function will find user by id and then generate access and refresh token then save refresh token and                                                  
try {                                                    // send it to data base without validating the password and other fields because it is unnecssary here
    const user = await User.findById(userId)
  if(!user) throw new Apierror(404 ,"user not found")

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false}) 

     return {accessToken ,refreshToken}
  } catch (error) {
    throw new Apierror(500, "something went wrong while generating token")
    
  }
}


// =============================
// REGISTER USER
// =============================
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, name, fullname } = req.body;

    
    if (!username || !name || !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}

// check existing user
    const userExists = await User.findOne({ email });
    
    if (userExists) return res.status(400).json({ message: "User already exists" });
 console.log(req.files);
  
    // upload profile image if provided
    let avatar;
    if (req.files && req.files.avatar) {
      avatar = await uploadImage(req.files.avatar[0].path); // uses Cloudinary
    }
    if(!avatar) throw new Apierror(400,"avatar nit found")

    // create user
    const user = await User.create({
      username,
      email,
      password,
      avatar : avatar,
      name,
      fullname,
    });

    // generate token
    //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar.url,
        name : user.name,
        fullname : user.fullname,
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: error.message });
    // throw new Apierror (500, "server register error")
    //res.status(500).json({ message: "Server on register error" });
  }
};

// =============================
// LOGIN USER
//from req.body take  data
//check is username or email exisits 
//compare password with associated email 
//generate access token refresh token
//send data through secure cookiees
//response that logged in successfully
// =============================
export const loginUser = async (req, res) => {
  try {
    const { email,username, password } = req.body;
    console.log(email)
    // find user

    if(!username && !email) {
      throw new Apierror(400, "username and email is required")
    }
    const user = await User.findOne(
      {
        $or: [{username} , {email}] // by this you can find 
      }
    );
    if (!user) return res.status(400).json({ message: "user does not exisit" });

    // check password
    const passwordvaild = await user.isPasswordCorrect(password)
    if(!passwordvaild) throw new Apierror(401,"password is incorrect")

    const {accessToken , refreshToken} =    await generateAccessRefreshToken(user._id)

    // remove unwanted fields that you dont want to send to client
    const loogedInUser = await User.findById(user._id).select( "-password -refreshToken")  //because this is original User which does not have anything in refershToken
   
    const options = {
      httpOnly : true,
      secure : true,
    }


    return res.status(200)
    .cookie("accessToken" , accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
      new ApiResponse(200,
        {user : loogedInUser,accessToken,refreshToken},
        "User logged in successfully"
      )
    )

   
    

  } catch (error) {
    console.error("Login Error:", error);
     //throw new Apierror (500, message)
    res.status(500).json({ message: error.message});
  }
};

export const logout = asyncHandler (async (req ,res)=>{
 await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
             
      }
    },
      {
        new : true

      }
    
  )

   const options = {
      httpOnly : true,
      secure : true,
    }
return res.status(200).clearCookie("accessToken" , options)
.clearCookie("refreshToken" , options)
.json(new ApiResponse(200,{},"User logged out "))
})



export const  refreshAccessToken = asyncHandler (async (req,res)=>{
  try{
  const incomingRefreshToken = req.cookies?.refreshToken || req?.body.refreshToken  //in mobile application the token are stored in body
 
  
  if(!incomingRefreshToken){
    throw new Apierror(400,"invaild incomming token so unauthorized request")
  }

  const decodedToken = await jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
 
   if(!decodedToken ) throw new Apierror(400 , "Invaild decodetoken ")


  try {

    const user = await User.findById(decodedToken._id)
    if(!user ) throw new Apierror(400 , "Invaild token !user")

      if(incomingRefreshToken  !==user?.refreshToken) {
        throw new Apierror(500,"expired token")
      } 

       const  options ={
          httpOnly :true,
          secure : true
        }

        //if you have passed this mucn code that means client refresh token is same as that of database refreshToken

        //Now generate new token that will be given to client so that they stay logged in

        const [accessToken , newRefreshToken] = await generateAccessRefreshToken(user?._id)

       return res.status(200)
       .cookie("accessToken" , accessToken , options)
       .cookie("RefreshToken" , newRefreshToken , options)
       .json(
        new ApiResponse(200,
          {accessToken , newRefreshToken},
          "Access Token refresh and newly generated"
        )
       )
      

  } catch (error) {
    throw new Apierror(500,error.message)
  }
  
}
catch(error){
  throw new Apierror(500 , error.message)
}
})