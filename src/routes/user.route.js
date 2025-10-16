import { Router } from "express";
import { registerUser,loginUser, logout, refreshAccessToken } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();
/*router.route('/register').post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1,
        },
        {
           name : "coverImage",
            maxCount : 1,
        }

    ]),
    registerUser)*/

router.route('/register').post( upload.fields([
    {
        name: "avatar",
        maxCount : 1,
    }
]), registerUser);


router.route('/login').post( loginUser)  //verify jWT is an middlerware first we will create token then make cookies then delete them with logout

//secured rooutes 

router.route('/logout').post( verifyJWT , logout)

router.route('/refreshToken').post(refreshAccessToken) 



export default router;