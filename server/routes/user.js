import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getUserCotroller, updateUserCotroller } from "../controllers/user.js";
import rateLimit from "express-rate-limit";
import { limiter } from "../config/rateLimit.js";

const userRoute = express.Router();

userRoute.get("/user", authMiddleware, getUserCotroller);
userRoute.put("/user", limiter, authMiddleware, updateUserCotroller);

export default userRoute;
