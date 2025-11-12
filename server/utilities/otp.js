import otpModel from "../models/otp.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export const generateOtp = async (email) => {
  try {
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

    const otp = uuidv4().slice(0, 6);

    const text = [
      `Your ${process.env.APP_NAME} verification code: ${otp}`,
      ``,
      `This code expires in 30 seconds.`,
      `If you didn’t request this, you can safely ignore this email.`,
    ].join("\n");

    transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      text,
      html: `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e6e6e6;border-radius:8px">
  <h2 style="margin:0 0 12px">${process.env.APP_NAME} Verification</h2>
  <p style="margin:0 0 16px">Use the code below to complete your sign-in.</p>

  <!-- Big, selectable OTP display -->
  <div style="font-size:32px;font-weight:700;letter-spacing:4px;padding:16px 12px;border:1px dashed #bbb;border-radius:6px;text-align:center;line-height:1.2;">
    <span style="font-family:Consolas,Menlo,Monaco,monospace;display:inline-block;user-select:all;-webkit-user-select:all;">${otp}</span>
  </div>

  <!-- Readonly input for easy copy on mobile (long-press) -->
  <div style="margin-top:12px;text-align:center;">
    <input
      value="${otp}"
      readonly
      style="width:260px;max-width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;
             font-size:18px;text-align:center;font-family:Consolas,Menlo,Monaco,monospace;display:inline-block;"
    />
    <div style="font-size:12px;color:#666;margin-top:6px;">Tip: long-press (mobile) or select and copy (Ctrl/Cmd+C).</div>
  </div>

  <p style="margin:16px 0 0">This code expires in <strong>1 minutes</strong>.</p>
  <p style="margin:8px 0 0;color:#555">If you didn’t request this, ignore this email.</p>

  <!-- Optional: link to a page where you can implement a real copy button with JS -->
  <div style="margin-top:16px;text-align:center;">
    <a href="https://yourdomain.com/verify?code=${encodeURIComponent(otp)}"
       style="display:inline-block;padding:10px 16px;border-radius:6px;border:1px solid #0a66c2;text-decoration:none;">
       Open verification page
    </a>
    <div style="font-size:12px;color:#666;margin-top:6px;">
      On the page you can auto-fill the code and offer a real “Copy” button.
    </div>
  </div>

  <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
  <p style="font-size:12px;color:#888;margin:0">Sent by ${
    process.env.APP_NAME
  }</p>
</div>
`,
    });

    const otpObj = {
      otp,
      email,
    };

    return await otpModel.create(otpObj);
  } catch (error) {
    return error.message;
  }
};
