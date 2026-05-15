const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const authControllers = require("../controllers/auth.controller");

const router = express.Router()


/* POST /register */
router.post("/register", authControllers.registerUser);

/* POST /login */ 
router.post("/login", authControllers.loginUser);

/* GET /currentUser */
router.get("/currentUser", authMiddleware.authUser, authControllers.getCurrentUser);

/* POST /logout */ 
router.post("/logout", authControllers.logoutUser);


module.exports = router