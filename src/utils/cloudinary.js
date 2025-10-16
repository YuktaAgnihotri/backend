// Require the cloudinary library
import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';
// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  
  
});

/////////////////////////
// Uploads an image file //
/////////////////////////
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: "auto",
      
    };

    try {
     
      if(!imagePath) return null
       // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result.public_id);  // or result.url 
      fs.unlinkSync(imagePath)
      return result.url;
    } catch (error) {
      fs.unlinkSync(imagePath) //remove the locally saved temporary file as the upload operation failed
      console.error(error);
      return null;
    }
};

// Log the configuration
console.log(cloudinary.config());

export default uploadImage;