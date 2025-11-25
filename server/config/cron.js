import cron from "node-cron";
import otpModel from "../models/otp.js";

// 24 hours
cron.schedule(" 0 0 * * * ", async () => {
  try {
    const cutoff = new Date(Date.now() - 2 * 60 * 1000); // 2 mins ago

    const deleted = await otpModel.deleteMany({
      createdAt: { $lt: cutoff },
    });
  } catch (error) {
    console.log(error.message);
  }
});
