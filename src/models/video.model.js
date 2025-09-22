import mongoose, { Schema } from "mongoose"

const videoSchema = new Schema({
    videoFile :{
        type : String,  // we will be taking url from 3rd party app
        required : true,
    },
    thumbnail : {
        type : String,  // we will be taking url from 3rd party app
        required : true,
    },
    description : {
        type : String,
        required :true,
    },
    duration : {
        type : Number,
        required :true,
    },
    views :{
        type : Number,
        required :true,
    },
    isPublished :{
        type : Boolean,
        default : true,
    }


   
},{timestamps :true})
 
export const Video = mongoose.model("Video" , videoSchema)