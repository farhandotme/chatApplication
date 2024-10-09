async function checkEmail(req, res) {
  const userModel = require("../models/userModel");
  try {
    const { email } = req.body;
    const checkEmail = await userModel.findOne({ email }).select("-password");
    if (!checkEmail) {
      return res.status(400).json({
        message: "User not exits",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Email verify",
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = { checkEmail };
