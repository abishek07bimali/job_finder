const UserDetailModel = require("../model/userdetailmodel")
const bcrypt = require("bcrypt");
const Users = require("../model/usermodel");


const updateUserDetail = async (req, res) => {
  console.log(req.body);

  const {
    userId,
    dob,
    fatherName,
    motherName,
    grandfatherName,
    grandmotherName,
    educationLevel,
    courseType,
    courseName,
    schoolName,
    educationBackground,
    recentJobTitle,
    jobType,
    employmentDuration,
    companyName,
    otherjobsDetail,
  } = req.body;

  // // step3 : validate the data
  if (
    !userId ||
    !dob||
    !fatherName ||
    !motherName ||
    !grandfatherName ||
    !grandmotherName ||
    !educationLevel ||
    !courseType ||
    !courseName ||
    !schoolName ||
    !educationBackground ||
    !recentJobTitle ||
    !jobType ||
    !employmentDuration ||
    !companyName ||
    !otherjobsDetail
  ) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });  }

  try {
    const userdetailUpdate = new UserDetailModel({
        userId: userId,
        dob:dob,
        fatherName: fatherName,
        motherName: motherName,
        grandfatherName: grandfatherName,
        grandmotherName: grandmotherName,
        educationLevel: educationLevel,
        courseType: courseType,
        courseName: courseName,
        schoolName: schoolName,
        educationBackground: educationBackground,
        recentJobTitle: recentJobTitle,
        jobType: jobType,
        employmentDuration: employmentDuration,
        companyName: companyName,
        otherjobsDetail: otherjobsDetail,

        });
    // await userdetailUpdate.save();

    await Users.updateOne({ _id: userId }, { isVerified: true });

    return res.status(201).json({
      success: true,
      message: "User details  successfully.",
    });
  } catch (error) {
    res.status(500).json("Server Error");
  }
};


// const getUserDetail = async (req, res) => {
//     const userId = req.params.userId;
  
//     try {
//       // Step 1: Find the liked jobs document for the given user ID
//       const userdetail = await Users.findOne({ userId });
  
//       if (!userdetail) {
//         return res.status(404).json({ message: "User details not found for this user." });
//       }
  
//       // Step 2: Fetch details for each liked job using the job IDs
//       const userdetailDetails = await Users.find({ _id: { $in: userdetail.userId } });
  
//       // console.log("success");
//       return res.json({
//         success: true,
//         userdetailDetails:userdetailDetails,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json("Server Error");
//     }
//   };


  module.exports = {
    updateUserDetail,
    // getUserDetail,
  };
