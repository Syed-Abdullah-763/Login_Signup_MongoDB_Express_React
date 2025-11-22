import userModel from "../models/user.js";

export const getUserCotroller = async (req, res) => {
  try {
    const userId = req.userId;

    const response = await userModel.findById(userId);
    console.log(response);

    const data = {
      name: response.name,
      age: response.age,
      email: response.email,
      imageUrl: response.imageUrl,
    };

    res.status(200).json({
      message: "User get successfully!",
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong",
      status: false,
    });
  }
};

export const updateUserCotroller = async (req, res) => {
  try {
    const obj = req.body;
    const userId = req.userId;

    const response = await userModel.findByIdAndUpdate(userId, obj, {
      new: true,
    });

    const data = {
      name: response.name,
      age: response.age,
      email: response.email,
      imageUrl: response.imageUrl,
    };
    res.status(200).json({
      message: "User updated successfully!",
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong",
      status: false,
    });
  }
};
