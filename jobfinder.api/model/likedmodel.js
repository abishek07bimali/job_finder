const mongoose = require("mongoose");

const likedSchema = mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", 
    required: true,
  },
  likedJobsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs", 
    },
  ],
});

const LikedModel = mongoose.model("likes", likedSchema);

module.exports = LikedModel;
