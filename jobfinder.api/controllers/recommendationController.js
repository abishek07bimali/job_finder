const LikedModel = require("../model/likedmodel");
const Jobs = require("../model/jobsmodel");
const Users = require("../model/usermodel");
const UserDetailModel = require("../model/userdetailmodel");

async function recommendJobs(req, res) {
  const userId = req.params.id;
  // console.log(userId);

  try {
    const userEducation = await UserDetailModel.findOne({ userId });
    // console.log(userEducation);

    const userAddress = await Users.findOne({ _id: userId });

    if (!userEducation) {
      return res.status(404).json({ message: 'User education details not found.' });
    }

    const userExperience = userEducation.employmentDuration;

    // Map user's experience to level
    let userExperienceLevel;
    if (userExperience >= 4) {
      userExperienceLevel = 'seniorLevel';
    } else if (userExperience > 1 ) {
      userExperienceLevel = 'midLevel';
    } else {
      userExperienceLevel = 'entryLevel';
    }
    const currentDate = new Date();

    // Get jobs with similar work type, education level, location, and experience level, 
    const recommendedJobs = await Jobs.find({
      $or: [
        {
          $and: [
            { jobType: userEducation.jobType },
            // { educationLevel: userEducation.educationodenLevel },
            // { experianceLevel: userExperienceLevel }, 
            // { category: userEducation.courseType }, 
          ],
        },
        {
          location: userAddress.address,
        },
      ],
      applyBefore: { $gte: currentDate },
    }).sort({
      matchingCriteriaCount: -1,
    });

    res.json({ recommendedJobs });

  } catch (error) {
    console.error('Error in recommendJobs function:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  recommendJobs,
};
