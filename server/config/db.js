import mongoose from "mongoose";

export const dbConnect = () => {
  const URI = process.env.MONGO_DB_URI;

  mongoose
    .connect(URI)
    .then(() => console.log("MongoDB is connected successfully!"))
    .catch((error) => console.log(error.message));
};
