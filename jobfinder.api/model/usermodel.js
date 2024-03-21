const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // dob: {
  //   type: String,
  //   required: true,
  // },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  otpExpires: {
    type: Date,
    default: () => Date.now() + 2 * 60 * 1000,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  cvFile:{
    type:String
  }
});

const Users = mongoose.model("users", userSchema);
module.exports = Users;
