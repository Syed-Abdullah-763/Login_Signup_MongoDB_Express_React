import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getUserCotroller, updateUserCotroller } from "../controllers/user.js";

const userRoute = express.Router();

userRoute.get("/user", authMiddleware, getUserCotroller);
userRoute.put("/user", authMiddleware, updateUserCotroller);

export default userRoute;
