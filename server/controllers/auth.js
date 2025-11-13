import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import { generateOtp } from "../utilities/otp.js";
import nodemailer from "nodemailer";
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

export const forgetPassword = async (req, res) => {
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
        message: "Invalid email",
        status: false,
      });
    }

    const token = jwt.sign({ _id: user._id, email }, process.env.PRIVATE_KEY, {
      expiresIn: "10m",
    });

    const FE_URL = `${process.env.FE_URL}change-password?q=${token}`;

    // send verify link
    const transporter = nodemailer.createTransport({
      service: "GMAIL",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset your password",
      html: `<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0">
<head>
  <meta charset="UTF-8" />
  <title>Reset your password</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;padding:24px;">
          <tr>
            <td style="text-align:left;">
              <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">
                Reset your password
              </h2>
              <p style="margin:0 0 12px;color:#4b5563;font-size:14px;line-height:1.5;">
                You recently requested to reset your password for your account. Click the button below to set a new password.
              </p>
              <p style="margin:0 0 20px;color:#4b5563;font-size:14px;line-height:1.5;">
                This link is valid for a limited time. If you did not make this request, you can safely ignore this email.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 16px;">
                <tr>
                  <td align="left">
                    <a href="${FE_URL}"
                       style="
                         display:inline-block;
                         padding:10px 20px;
                         background:linear-gradient(180deg,#3b82f6,#2563eb);
                         color:#ffffff;
                         text-decoration:none;
                         border-radius:6px;
                         font-weight:bold;
                         font-size:14px;
                       ">
                      Change Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#6b7280;font-size:12px;line-height:1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 16px;color:#2563eb;font-size:12px;word-break:break-all;">
                ${FE_URL}
              </p>

              <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;">
                If you didn’t request a password reset, you can ignore this email.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:11px;">
                Thanks,<br />
                The ${process.env.APP_NAME || "Our"} Team
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0;color:#9ca3af;font-size:11px;text-align:center;">
          © ${new Date().getFullYear()} ${
        process.env.APP_NAME || "Our App"
      }. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    res.status(200).json({
      message: "Please check your email",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Required Fields are missing",
        status: false,
      });
    }

    const verifyToken = jwt.verify(token, process.env.PRIVATE_KEY);

    if (!verifyToken.email || !verifyToken._id) {
      return res.status(401).json({
        message: "Invalid token",
        status: false,
      });
    }

    const hashPaaword = await bcrypt.hash(newPassword, 10);

    await userModel.findByIdAndUpdate(verifyToken._id, {
      password: hashPaaword,
    });

    res.status(200).json({
      message: "Password updated successfully!",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};
