import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnect } from "./config/db.js";
import authRoute from "./routes/auth.js";
import imageRoute from "./routes/image.js";
import userRoute from "./routes/user.js";
import { limiter } from "./config/rateLimit.js";
import "./config/cron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body Praser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// db Connection
dbConnect();

// all apis
app.use("/api/auth", limiter, authRoute);
app.use("/api/image", limiter, imageRoute);
app.use("/api/user", userRoute);

// root api
app.get("/", (req, res) => {
  res.json({
    message: "Server running...",
  });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
