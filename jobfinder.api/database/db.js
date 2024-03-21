const dotenv = require("dotenv");

const { mongoose } = require("mongoose");

const connectDB = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/job_finder").then(() => {
    console.log(`MongoDB connected`);
  });
};

module.exports = connectDB;
