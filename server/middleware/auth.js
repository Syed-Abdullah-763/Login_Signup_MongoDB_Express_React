import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    const isVerify = jwt.verify(token, process.env.PRIVATE_KEY);

    if (isVerify) {
      req.userId = isVerify.id;

      next();
    } else {
      res.status(401).json({
        message: "unAuth user!",
        status: false,
      });
    }
  } catch (error) {
    res.status(401).json({
      message: error.message,
      status: false,
    });
  }
};

export default authMiddleware;
