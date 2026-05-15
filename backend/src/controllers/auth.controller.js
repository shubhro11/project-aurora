const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Register Controller */
async function registerUser(req, res) {
  const {
    fullName: { firstName, middleName, lastName },
    email,
    password,
  } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists)
    return res.status(409).json({ message: "Email address already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: { firstName, middleName, lastName },
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});

  res.status(201).json({
    message: "User Registered Successfully",
    _id: user._id,
    fullName: user.fullName,
    token: token,
  });
}


/* Login Controller */
async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) return res.status(409).json({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword)
    return res.status(409).json({ message: "Incorrect Password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token , {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});

  return res.status(201).json({
    message: "User Logged-in Successfully",
    _id: user._id,
    email: user.email,
    token: token,
  });
}


/* Logout Controller */
async function logoutUser(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while logging out user, please try again",
      success: false,
    });
  }
}


/* getCurrentUser Controller */
async function getCurrentUser(req, res) {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};
