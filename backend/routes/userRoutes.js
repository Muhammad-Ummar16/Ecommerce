import express from "express";
import { registerUser, loginUser, googleAuth, sendOTP, verifyOTP, getUserProfile, updateUserProfile } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/google-auth", googleAuth);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
