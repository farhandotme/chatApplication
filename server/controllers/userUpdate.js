const getUserDetailsFromToken = require("../middlewares/userDetailsFromToken");
const userModel = require("../models/userModel");

async function updateUserDetails(req, res) {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);
    const { name, profilePic } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { name, profilePic },
      { new: true }
    );

    const userinfo = await userModel.findById(user._id);

    return res.json({
      message: "User Updated Successfully",
      data: userinfo,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = updateUserDetails;
