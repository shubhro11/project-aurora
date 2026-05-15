const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// authUser
async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token)
    return res.status(409).json({
      message: "Unauthorized Access, please login to continue",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    req.user = user;
    next();
  } catch (err) {
    return res.status(409).json({
      message: "Unauthorized Access [Invalid Token], please login to continue",
    });
  }
}

module.exports = {
  authUser,
};
