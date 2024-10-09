const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

async function registerUsers(req, res) {
  try {
    const { name, email, password, profilePic } = req.body;
    const checkEmail = await userModel.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "Already user exits",
        error: true,
      });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          const user = await userModel.create({
            name,
            email,
            password: hash,
            profilePic,
          });
          return res.status(201).json({
            message: "User created successfully",
            data: user,
            success: true,
          });
        });
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = { registerUsers };
