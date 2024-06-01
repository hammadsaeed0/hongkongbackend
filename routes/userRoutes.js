import express from "express";
import { GetAllProfile, Login, MyProfile, Register, UpdateProfile } from "../controller/userController.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/my-profile/:userId").get(MyProfile);
router.route("/update-profile/:userId").post(UpdateProfile);
router.route("/profile").get(GetAllProfile);



export default router;
