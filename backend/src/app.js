const express = require("express")

/* Routes */
const authRoutes = require("./routes/user.route");
const chatRoutes = require("./routes/chat.route");

const app = express()

/* Middlewares */
app.use(cookieParser());
app.use(morgan("dev"))
app.use(express.json());


module.exports = app