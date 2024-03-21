const JobsApplicationModel = require("../model/applicationmodel");
const Jobs = require("../model/jobsmodel");
const io = require('../index').io;
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'merojagir0@gmail.com', 
      pass: 'bsbi tqzn xcga akqg', 
      // user: 'learnadvert9@gmail.com', 
      // pass: 'ncof ghpg lzrp klmr', 
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'merojagir0@gmail.com',
    to: to,
    subject: subject,
    text: text,
  });

  console.log('Email sent: %s', info.messageId);
};


const applyJobs = async (req, res) => {
    console.log(req.body);
    const { userId, jobsId } = req.body;    
    try {
        // check if the job is already applied or not
        const isApplied = await JobsApplicationModel.findOne({
            userId: userId,
            jobsId: jobsId,
        });
        if (isApplied) {
            return res.json({
                success: false,
                message: "You have already applied for this job.",
            });
        }
        const newApplication = new JobsApplicationModel({
            userId: userId,
            jobsId: jobsId,
        });
        const savedApplication = await newApplication.save();
        res.status(200).json({
            success: true,
            message: "Application saved successfully.",
            data: savedApplication,
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Application not saved.",
            errorMessage: err.message,
        });
    }
}
// 
// get all apllication list
const getAllApplication = async (req, res) => {
    try {
        const allApplication = await JobsApplicationModel.find()
            .populate('userId') 
            .populate('jobsId')  
            .sort({ createdAt: -1 });
            

        res.status(200).json({
            success: true,
            application: allApplication,
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error in fetching all application.",
            errorMessage: err.message,
        });
    }
}
// get all apllication list
const     getAllApplicationByAdmin= async (req, res) => {
  const id = req.params.id;
  console.log(req.params)
  try {
    const job = await Jobs.findOne({ userId: id });
    if(!job){
      return
    }
    const allApplication = await JobsApplicationModel.find({ jobsId: job._id }) .populate('userId') 
    .populate('jobsId')  
    .sort({ createdAt: -1 });   

    console.log(allApplication)
      res.json({
          success: true,
          application: allApplication,
      });
  } catch (err) {
      console.log(err);
      res.json({
          success: false,
          message: "Error in fetching all application.",
          errorMessage: err.message,
      });
  }
}

// update application status
const updateApplicationStatus = async (req, res) => {
  const { applicationid, isVerified, interview } = req.body;

  try {
    // Find the application including the associated user information
    const findApplication = await JobsApplicationModel
      .findById(applicationid)
      .populate('userId')
      .populate('jobsId');

    if (!findApplication) {
      return res.json({
        success: false,
        message: 'Application not found.',
      });
    }

    const userEmail = findApplication.userId.email;
    // console.log(userEmail)

    // Update the isVerified field
    findApplication.isVerified = isVerified;
    if (interview) {
      findApplication.interview = interview;
    }

    const updatedApplication = await findApplication.save();

    // Send email to the user
    if (userEmail) {
      const emailSubject = 'Application Status Update';
      const emailText = `
      Dear ${findApplication.userId.firstName},
    
      Your application status has been updated. Here are the details:
    
      - Status: ${isVerified ? 'Verified' : 'Not Verified'}
      ${interview ? `- Interview Date: ${interview}` : ''}
      ${`Job Title Data: ${findApplication.jobsId.jobTitle}` }
    
      Thank you for using our application system.
    
      Best regards,
      ${findApplication.jobsId.companyName}
    `;
          
      await sendEmail(userEmail, emailSubject, emailText);
    }

    res.json({
      success: true,
      message: 'Application status updated successfully.',
      data: updatedApplication,
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: 'Error in updating application status.',
      errorMessage: err.message,
    });
  }
};

const rejectApplication = async (req, res) => {
  const { applicationid, isRejected } = req.body;

  try {
    const findApplication = await JobsApplicationModel.findById({ _id: applicationid });

    if (!findApplication) {
      return res.json({
        success: false,
        message: "Application not found.",
      });
    }

    findApplication.isRejected = isRejected;

    const updatedApplication = await findApplication.save();

    res.json({
      success: true,
      message: "Application status updated successfully.",
      data: updatedApplication,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error in updating application status.",
      errorMessage: err.message,
    });
  }
}


// 
// count total application
const countTotalApplication = async (req, res) => {
    const userId = req.params.id;
    try {
        const totalApplication = await JobsApplicationModel.countDocuments();
      return  res.json({
            success: true,
            count: totalApplication,
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error in counting total application.",
            errorMessage: err.message,
        });
    }
}

// count new application in last 7 days
const countNewApplication = async (req, res) => {
    try {
        const currentDate = new Date();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
    
        const totalApplication = await JobsApplicationModel.countDocuments({
            createdAt: { $gte: sevenDaysAgo, $lte: currentDate },
        });
       return res.json({
            success: true,
            count: totalApplication,
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error in counting total application.",
            errorMessage: err.message,
        });
    }
}

//  graph for total application in last 7 days
//  get user growth in past 7 days
const getApplicationGrowthInPast7Days = async (req, res) => {
    try {
      const currentDate = new Date();
  
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
  
      const userapplicationGrowthData = await JobsApplicationModel.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo, $lte: currentDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            value: "$count",
            _id: 0,
          },
        },
        {
            $sort: { date: 1 }, // Sort in ascending order by date
          },
      ]);
  
      return res.json({
        success: true,
        data: userapplicationGrowthData,
        message: "Application growth in the past 7 days.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  const sendNotification = async (req, res) => {
    // console.log(req.body);
    const { userId } = req.body;
  
    try {
      // Find the application using the userId
      const findApplication = await JobsApplicationModel.findOne({ userId: userId });
  
      if (findApplication) {
        // Check if the application is verified
        if (findApplication.isVerified) {
          // Emit a notification to the user
          req.io.emit('notification', { userId: userId, message: 'Your application is verified.' });
  
          return res.json({
            success: true,
            notification: { userId: userId, message: 'Your application is verified.' },
            message: 'Notification sent successfully.',
          });

        } else {
          return res.json({
            success: false,
            message: 'Application is not yet verified.',
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'Application not found for the specified user.',
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Error in updating application status.',
        errorMessage: err.message,
      });
    }
  };

  const getApplicationByUserId = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find applications for the given user and populate the "jobsId" field
      const applications = await JobsApplicationModel.find({ userId }).populate('jobsId').sort({ createdAt: -1 });
      ;
  
      if (!applications || applications.length === 0) {
        return res.status(404).json({ message: "Applications not found for this user." });
      }
  
      const jobIds = applications.map(app => app.jobsId._id);
  
      if (jobIds.length === 0) {
        return res.status(404).json({ message: "No jobs found for the given applications." });
      }
  
      // const jobDetails = await Jobs.find({ _id: { $in: jobIds } });
  
      return res.status(200).json({
        success: true,
        applications: applications,
        // jobDetails: jobDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  
  
  
module.exports = {
    applyJobs,
    getAllApplication,
    updateApplicationStatus,
    rejectApplication,
    countTotalApplication,
    countNewApplication,
    getApplicationGrowthInPast7Days,
    sendNotification,
    getApplicationByUserId,
    getAllApplicationByAdmin
}