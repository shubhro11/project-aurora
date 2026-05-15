const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}aurora-ai`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(`Error occurred while connecting to MongoDB: ${error}`);
  }
}

module.exports = connectDB;
