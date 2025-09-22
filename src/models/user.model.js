import mongoose from "mongoose"
import bcrypt from "bcypt"
import { JsonWebTokenError } from "jsonwebtoken"

const UserSchema  = new Schema({ 
   username :{
    type : String,
    required: true,
    unique : true,
    lowercase : true,
    trim  : true,
    index : true,
   },
   email : {
    type : String,
    required: true,
    unique : true,
    lowercase : true,
    trim  : true,
   },
   fullname :{
    type : String,
    required: true,
    unique : true,
    lowercase : true,
    trim  : true,
    index : true,
   },
   avatar : {
    type : String,
    required : true,
   },
   covereImage: {
    type :String, // getting link of image from 3rd party app
   },
   watchHistory : [
    {
        type : Schema.Types.objectId,
        ref : "Video",
    }
   ],
   password : {
    type : String,
    required :[true,"password is required"]
   },
   refreshToken : {
    type :String,
   },

},{timestamps : true})

UserSchema.pre("save" , async function(next){
 if(!this.isModified("password")) return next();
 
this.password = bcrypt.hash(this.password, 10);
next();
})

UserSchema.method("save", async function (next) {
    return await bcrypt.compare(password , this.password)  // compare exisiting password and new password
    
})
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname,
        },
         process.env.ACCESS_TOKEN_EXPIRY,
         {

         }
        
    )
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            
        },
         process.env.REFRESH_TOKEN_EXPIRY,
         {

         }
        
    )
}
export const User = mongoose.model("User", UserSchema);

