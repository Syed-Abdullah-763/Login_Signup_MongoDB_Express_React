import express from "express";
import {
  signupController,
  loginController,
  verifyOtpController,
  resendOtp,
  forgetPassword,
  changePassword,
} from "../controllers/auth.js";

const authRoute = express.Router();

authRoute.post("/signup", signupController);
authRoute.post("/login", loginController);

// otp
authRoute.post("/verify-otp", verifyOtpController);
authRoute.post("/resend-otp", resendOtp);

// Password
authRoute.post("/forget-password", forgetPassword);
authRoute.post("/change-password", changePassword);

export default authRoute;
