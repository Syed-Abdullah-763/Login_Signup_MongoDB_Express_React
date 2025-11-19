import express from "express";
import { upload } from "../middleware/multer.js";
import authMiddleware from "../middleware/auth.js";
import { cloudinaryUploader, cloudinaryConfig } from "../config/cloudinary.js";
import userModel from "../models/user.js";
import fs from "fs";

const imageRoute = express.Router();

imageRoute.post(
  "/image",
  [authMiddleware, upload.single("profileImage")],
  async (req, res) => {
    try {
      cloudinaryConfig();
      const imageRes = await cloudinaryUploader.upload(req.file.path);
      console.log(imageRes);

      await userModel.findByIdAndUpdate(req.userId, {
        imageUrl: imageRes.secure_url,
      });

      res.status(200).json({
        message: "Image uploaded Succesfully!",
        status: true,
        url: imageRes.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: false,
      });
    } finally {
      fs.unlinkSync(req.file.path);
    }
  }
);

export default imageRoute;
