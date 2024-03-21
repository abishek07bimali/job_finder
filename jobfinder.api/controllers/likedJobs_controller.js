const Jobs = require("../model/jobsmodel");
const LikedModel = require("../model/likedmodel");

const likedJobs = async (req, res) => {
  const { userId, likedJobsId } = req.body;
  console.log(req.body);

  try {
    // Step 1: Find the user based on userId
    let existingLikedJobsByUser = await LikedModel.findOne({ userId });
    if (existingLikedJobsByUser) {
      // Check if the liked job already exists in the array
      const index = existingLikedJobsByUser.likedJobsId.indexOf(likedJobsId);
      if (index !== -1) {
        // If the liked job exists, remove it from the array
        existingLikedJobsByUser.likedJobsId.splice(index, 1);
      } else {
        // If the liked job doesn't exist, add it to the array
        existingLikedJobsByUser.likedJobsId.push(likedJobsId);
      }
      // Save the updated document
      await existingLikedJobsByUser.save();
    } else {
      // If the document doesn't exist, create a new one
      const newLikedJobs = new LikedModel({
        userId,
        likedJobsId: [likedJobsId],
      });
      await newLikedJobs.save();
    }
    // Return success response
    return res.status(201).json({
      success: true,
      message: "Jobs have been saved.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
};


const getLikedJobsByUserId = async (req, res) => {
    const userId = req.params.userId;
    console.log(req.params.userId)
  console.log(req.params)
    try {
      // Step 1: Find the liked jobs document for the given user ID
      const likedJobs = await LikedModel.findOne({ userId });
  
      if (!likedJobs) {
        return res.status(404).json({ message: "Liked jobs not found for this user." });
      }
  
      // Step 2: Fetch details for each liked job using the job IDs
      const likedJobsDetails = await Jobs.find({ _id: { $in: likedJobs.likedJobsId } });
  
      // console.log("success");
      return res.json({
        success: true,
        // likedJobs:likedJobs,
        likedJobsDetails:likedJobsDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  };
  

module.exports = { likedJobs,getLikedJobsByUserId };
