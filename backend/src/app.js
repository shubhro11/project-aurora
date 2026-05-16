const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const morgan = require("morgan")
const path = require("path");

/* Routes */
const authRoutes = require("./routes/user.route");
const chatRoutes = require("./routes/chat.route");

const app = express();

/* Middlewares */
app.use(
    cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"))
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

/* Using Routes */
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
