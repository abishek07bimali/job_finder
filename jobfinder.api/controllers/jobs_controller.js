const Jobs = require("../model/jobsmodel");
const cloudinary = require("cloudinary");
const Users = require("../model/usermodel");
const JobsApplicationModel = require("../model/applicationmodel");
const LikedModel = require("../model/likedmodel");

const addJobs = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const {
    jobTitle,
    companyName,
    location,
    jobType,
    experianceLevel,
    educationLevel,
    jobDescription,
    jobResponsibility,
    salary,
    companyOverview,
    contact,
    workType,
    jobTags,
    userId,
    category,
    selectedDate
  } = req.body;

  const { jobsImage } = req.files;

  // // step3 : validate the data
  if (
    !jobTitle ||
    !companyName ||
    !location ||
    !jobType ||
    !experianceLevel ||
    !educationLevel ||
    !jobDescription ||
    !jobResponsibility ||
    !salary ||
    !companyOverview ||
    !contact ||
    !workType ||
    !jobTags ||
    !category||
    !jobsImage||
    !selectedDate
  ) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const uploadImage = await cloudinary.v2.uploader.upload(jobsImage.path, {
      folder: "product",
      crop: "scale",
    });
    const newJobs = new Jobs({
      userId: userId,
      jobTitle: jobTitle,
      companyName: companyName,
      location: location,
      jobType: jobType,
      experianceLevel: experianceLevel,
      educationLevel: educationLevel,
      jobDescription: jobDescription,
      jobResponsibilities: jobResponsibility,
      salary: salary,
      companyOverview: companyOverview,
      contact: contact,
      workType: workType,
      category: category,
      applyBefore: selectedDate,
      jobTags: JSON.parse(jobTags),
      image: uploadImage.secure_url,
    });
    console.log(newJobs);
    await newJobs.save();
    return res.json({
      success: true,
      message: "Jobs has been posted successfully.",
    });
  } catch (error) {
    res.status(500).json("Server Error");
  }
};

// function to get all jobs
const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query._page, 10);
    const limit = parseInt(req.query._limit, 10);

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      const skip = (page - 1) * limit;
      const currentDate = new Date();

      const listofJobs = await Jobs.find({
        applyBefore: { $gte: currentDate }, 
      }).skip(skip).limit(limit);

      return res.json({
        success: true,
        jobs: listofJobs,
        message: `Showing page ${page} with ${limit} jobs per page`,
      });
    } else {
      const currentDate = new Date();
      const listofJobs = await Jobs.find({
        applyBefore: { $gte: currentDate }, 
      });

      return res.json({
        success: true,
        jobs: listofJobs,
        message: "Showing all Jobs",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllJobsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query._page, 10);
    const limit = parseInt(req.query._limit, 10);

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      const skip = (page - 1) * limit;
      const listofJobs = await Jobs.find()
        .sort({ createdAt: -1 }) // Sort jobs by createdAt field in descending order
        .skip(skip)
        .limit(limit);

      return res.json({
        success: true,
        jobs: listofJobs,
        message: `Showing page ${page} with ${limit} jobs per page`,
      });
    } else {
      const listofJobs = await Jobs.find().sort({ createdAt: -1 }); // Sort all jobs by createdAt field in descending order
      
      return res.json({
        success: true,
        jobs: listofJobs,
        message: "Showing all Jobs",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getJobsWithoutSaved = async (req, res) => {
  const userId = req.params.userId;
  try {
    const page = parseInt(req.query._page, 10);
    const limit = parseInt(req.query._limit, 10);

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      const skip = (page - 1) * limit;
      const currentDate = new Date();

      const userApplications = await JobsApplicationModel.find({ userId }).select('jobsId');
      const userAppliedJobIds = userApplications.map(application => application.jobsId);

      const userSavedJobs = await LikedModel.findOne({ userId }).select('likedJobsId');
      const userSavedJobIds = userSavedJobs ? userSavedJobs.likedJobsId : [];

      const listofJobs = await Jobs.find({
        _id: { $nin: [...userAppliedJobIds, ...userSavedJobIds] },
        applyBefore: { $gte: currentDate }, 
      }).skip(skip).limit(limit);

      return res.json({
        success: true,
        jobs: listofJobs,
        message: `Showing page ${page} with ${limit} jobs per page`,
      });
    } else {
      const currentDate = new Date();

      const userApplications = await JobsApplicationModel.find({ userId }).select('jobsId');
      const userAppliedJobIds = userApplications.map(application => application.jobsId);

      const userSavedJobs = await LikedModel.findOne({ userId }).select('likedJobsId');
      const userSavedJobIds = userSavedJobs ? userSavedJobs.likedJobsId : [];

      const listofJobs = await Jobs.find({
        _id: { $nin: [...userAppliedJobIds, ...userSavedJobIds] },
        applyBefore: { $gte: currentDate }, 
      });

      return res.json({
        success: true,
        jobs: listofJobs,
        message: "Showing all Jobs",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





// function to get all jobs
const getAllJobsByUserId = async (req, res) => {
  // res.send("API is connected")
  const id = req.params.id;

  try {
    const listofJobs = await Jobs.find({ userId: id });
    console.log(listofJobs);

    return res.json({
      success: true,
      jobs: listofJobs,
      message: "Showing all Jobs",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
};

const deleteJobs = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json({
      success: false,
      message: "Jobs id not found",
    });
  }
  const isApplication= await JobsApplicationModel.findOne({jobsId:id});
  console.log(isApplication)

  if(isApplication){
    return res.json({
      success: false,
      message: "Jobs Cannot be deleted because the application is present for that job",
    });
  }
  try {
    await Jobs.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: "Jobs deleted sucessfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// get the jobs by id
const getSingleJobs = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json({
      success: false,
      message: "Jobs id not found.",
    });
  }
  try {
    const jobs = await Jobs.findById(id);
    if (!jobs) {
      return res.json({
        success: false,
        message: "Job not found.",
      });
    }
    return res.json({
      success: true,
      jobs: jobs,
      message: "Data found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
};

// update the product
const UpdateJobs = async (req, res) => {
  console.log(req.body);
  // console.log(req.files)

  const {
    jobTitle,
    companyName,
    location,
    jobType,
    experianceLevel,
    educationLevel,
    jobDescription,
    jobResponsibility,
    salary,
    companyOverview,
    contact,
    workType,
    jobTags,
    category,
    selectedDate
  } = req.body;

  //  files like iamges
  const { image } = req.files;

  //  descructuring id from the url
  const id = req.params.id;

  if (
    !jobTitle ||
    !companyName ||
    !location ||
    !jobType ||
    !experianceLevel ||
    !educationLevel ||
    !jobDescription ||
    !jobResponsibility ||
    !salary ||
    !companyOverview ||
    !contact ||
    !workType ||
    !jobTags||
    !category||
    !selectedDate
  ) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    if (image) {
      const uploadImage = await cloudinary.v2.uploader.upload(image.path, {
        folder: "product",
        crop: "scale",
      });

      const updateJobs = {
        jobTitle: jobTitle,
        companyName: companyName,
        location: location,
        jobType: jobType,
        experianceLevel: experianceLevel,
        educationLevel: educationLevel,
        jobDescription: jobDescription,
        jobResponsibilities: jobResponsibility,
        salary: salary,
        companyOverview: companyOverview,
        contact: contact,
        workType: workType,
        category: category,
        applyBefore: selectedDate,
        jobTags: JSON.parse(jobTags),
        image: uploadImage.secure_url,
      };

      await Jobs.findByIdAndUpdate(id, updateJobs);

      return res.json({
        success: true,
        message: "Jobs Updated Sucessfully.",
      });
    } else {
      const updateJobs = {
        jobTitle: jobTitle,
        companyName: companyName,
        location: location,
        jobType: jobType,
        experianceLevel: experianceLevel,
        educationLevel: educationLevel,
        jobDescription: jobDescription,
        jobResponsibilities: jobResponsibility,
        salary: salary,
        companyOverview: companyOverview,
        contact: contact,
        workType: workType,
        category: category,
        applyBefore: selectedDate,
        jobTags: JSON.parse(jobTags),
      };

      await Jobs.findByIdAndUpdate(id, updateJobs);
      return res.json({
        success: true,
        message: "Jobs Updated Sucessfully without image.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// get all jobs data count
const countJobs = async (req, res) => {
  try {
    const countJobs = await Jobs.countDocuments();
    return res.json({
      success: true,
      count: countJobs,
      message: "Total Jobs",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// count new job posted in last 7 days
const countNewJobs = async (req, res) => {
  try {
    const currentDate = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const totalJobs = await Jobs.countDocuments({
      createdAt: { $gte: sevenDaysAgo, $lte: currentDate },
    });
    return res.json({
      success: true,
      count: totalJobs,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error in counting total Jobs.",
      errorMessage: err.message,
    });
  }
};

// get jobs near me
const getJobsNearMe = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Find the user by ID
    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 2: Find jobs with matching location
    const jobs = await Jobs.find({ location: user.address });

    // Step 3: Return the list of jobs
    return res.json({
      success: true,
      jobs: jobs,
      message: "Jobs near user's location",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// get filtered jobs by worktype

const getFilteredJobs = async (req, res) => {
  console.log(req.params);
  const { workType } = req.params;
  const workTypesArray = workType.split(",").map((type) => type.trim());
  console.log(workTypesArray);
  try {
    const jobs = await Jobs.find({
      $or: [
        { workType: { $in: workTypesArray } },
        { jobType: { $in: workTypesArray } },
        { educationLevel: { $in: workTypesArray } },
        { experianceLevel: { $in: workTypesArray } },
      ],
    });
    // console.log(jobs);
    return res.json({
      success: true,
      jobs: jobs,
      message: "Jobs filtered by work type",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getSearchJobs = async (req, res) => {
  const { searchQuery } = req.params;

  const today = new Date();
  
  // Create a regular expression pattern from the search query
  const regexPattern = new RegExp(searchQuery, "i");

  try {
    const jobs = await Jobs.find({
      $and: [
        {
          $or: [
            { jobTitle: { $regex: regexPattern } },
            { companyName: { $regex: regexPattern } },
            { jobLocation: { $regex: regexPattern } },
          ]
        },
        { applyBefore: { $gte: today } } // applyBefore should be after or equal to today
      ]
    });

    // console.log(jobs);

    return res.json({
      success: true,
      jobs: jobs,
      message: "Jobs searched by criteria",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addJobs,
  getAllJobs,
  getAllJobsForAdmin,
  getJobsWithoutSaved,
  getAllJobsByUserId,
  getSingleJobs,
  deleteJobs,
  UpdateJobs,
  countJobs,
  countNewJobs,
  getJobsNearMe,
  getFilteredJobs,
  getSearchJobs,
};
