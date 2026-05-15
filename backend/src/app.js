const express = require("express")

/* Routes */
const authRoutes = require("./routes/user.route");
const chatRoutes = require("./routes/chat.route");

const app = express()

app.use(express.json());


module.exports = app