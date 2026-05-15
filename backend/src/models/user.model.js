const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true,
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
