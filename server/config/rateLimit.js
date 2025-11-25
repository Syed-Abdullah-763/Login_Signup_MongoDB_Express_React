import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true, // Sends `RateLimit-*` response headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
