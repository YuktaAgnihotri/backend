import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";

const router = Router();
router.route('/register').post(
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
    registerUser)

//router.route('/login').post(login)
export default router;