import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("./uploads/")) {
      fs.mkdir("./uploads/", (err, res) => {
        cb(false, "./uploads/");
      });
    } else {
      cb(false, "./uploads/");
    }
  },
  filename: (req, file, cb) => {
    const fileName = `${new Date().getTime}-${file.originalname}`;
    cb(false, fileName);
  },
});

export const upload = multer({
  storage: storage,
});
