const mongoose = require("mongoose");

const jobsApplicationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  jobsId:
    // [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs",
      required: true,
    },
  // ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  interview: {
    type: String,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
});

const JobsApplicationModel = mongoose.model(
  "application",
  jobsApplicationSchema
);
module.exports = JobsApplicationModel;
