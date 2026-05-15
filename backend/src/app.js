const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const morgan = require("morgan")

/* Routes */
const authRoutes = require("./routes/user.route");
const chatRoutes = require("./routes/chat.route");

const app = express();

/* Middlewares */
app.use(cookieParser());
app.use(morgan("dev"))
app.use(express.json());

/* Using Routes */
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
