import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import { generateOtp } from "../utilities/otp.js";
import otpModel from "../models/otp.js";

export const signupController = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    if (!name || !age || !email || !password) {
      return res.status(400).json({
        message: "Required fields are missing",
        status: false,
        data: null,
      });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "Email aready exists",
        status: false,
        data: null,
      });
    }

    const hashPaaword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      ...req.body,
      password: hashPaaword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.PRIVATE_KEY, {
      expiresIn: "24h",
    });

    // Verification email
    const otpResponse = await generateOtp(email);

    res.status(201).json({
      message: "user created successfuly!",
      status: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
      data: null,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Required Fields are missing",
        status: false,
        data: null,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email or Pasword is invalid",
        status: false,
        data: null,
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Your email is not verified. Please verify your email address",
        status: false,
        data: null,
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: false,
        data: null,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY, {
      expiresIn: "24h",
    });

    const userObj = {
      name: user.name,
      email: user.email,
      age: user.age,
      _id: user._id,
    };

    res.status(200).json({
      message: "User loggedin successfully!",
      status: true,
      data: userObj,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
      data: null,
    });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Required fields are missing",
        status: false,
      });
    }

    const isExist = await otpModel
      .findOne({ email, isUsed: false })
      .sort({ createdAt: -1 });

    if (!isExist) {
      return res.status(401).json({
        message: "Invalid OTP",
        status: false,
      });
    }

    // check expiry
    const OTP_EXPIRY = 1 * 60 * 1000;
    const now = Date.now();
    const createdAt = new Date(isExist.createdAt).getTime();

    if (now - createdAt > OTP_EXPIRY) {
      return res.status(401).json({
        message: "OTP expired",
        status: false,
      });
    }

    if (isExist.otp !== otp) {
      return res.status(401).json({
        message: "Invalid OTP",
        status: false,
      });
    }

    await otpModel.findByIdAndUpdate(isExist._id, { isUsed: true });
    await userModel.findOneAndUpdate({ email }, { isVerified: true });

    res.status(200).json({
      message: "OTP Verified",
      status: true,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
      data: null,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        status: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email does not exist",
        status: false,
      });
    }

    const otpResponse = await generateOtp(email);

    res.status(201).json({
      message: "OTP has been sent, please check your email",
      status: true,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
      data: null,
    });
  }
};
