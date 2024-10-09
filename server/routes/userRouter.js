const express = require("express");
const router = express.Router();
const { registerUsers } = require("../controllers/registerUser");
const { checkEmail } = require("../controllers/checkEmail");
const checkPassword = require("../controllers/checkPassword");
const userDetails = require("../controllers/userDetails");
const logout = require("../controllers/logout");
const updateUserDetails = require("../controllers/userUpdate");

// register User
router.post("/register", registerUsers);

//Check email
router.post("/email", checkEmail);

//check password

router.post("/checkPassword", checkPassword);

//login

router.get("/userDetails", userDetails);

//LOGOUT

router.get("/logout", logout);

// update user details
router.post("/userUpdate", updateUserDetails);

module.exports = router;
