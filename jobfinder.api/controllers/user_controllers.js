const Users = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "merojagir0@gmail.com",
      pass: "bsbi tqzn xcga akqg",
      // user: 'learnadvert9@gmail.com',
      // pass: 'ncof ghpg lzrp klmr',
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: "merojagir0@gmail.com",
    to: to,
    subject: subject,
    text: text,
  });

  console.log("Email sent: %s", info.messageId);
};

const createUser = async (req, res) => {
  // // step1 : Check incomming data
  console.log(req.body);
  // // step2 : destructuring the json data
  const {
    firstName,
    lastName,
    email,
    password,
    // dob,
    address,
    phone,
  } = req.body;

  // // step3 : validate the data
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    // !dob ||
    !address ||
    !phone
  ) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    // step 5
    //  check existing user
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already exist.",
      });
    }
    // password encryption
    const generatesalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, generatesalt);
    const otp = await Math.floor(10000 + Math.random() * 90000);
    console.log(otp);

    // step 6 create new user
    const newuser = new Users({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: encryptedPassword,
      // dob: dob,
      address: address,
      phone: phone,
      otp: otp,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    await newuser.save();
    return res.status(200).json({
      success: true,
      message: "user created successfully.",
    });
  } catch (error) {
    res.status(500).json("Server Error");
  }
};

const loginUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const user = await Users.findOne({ email: email });

    if (user == null) {
      return res.status(201).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(202).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      userData: user,
      token: token,
      message: "Login Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// change password API
const changePassword = async (req, res) => {
  console.log(req.body);
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const user = await Users.findOne({ _id: userId }); // user stotre the data from email by fething from database

    if (user == null) {
      return res.json({
        success: false,
        message: "cannot find users.",
      });
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.json({
        success: false,
        userData: user,
        message: "Old Password is incorrect.",
      });
    }
    // check if the new password na new password is same or not
    if (oldPassword === newPassword) {
      return res.json({
        success: false,
        userData: user,
        message: "New Password is same as old password.",
      });
    }

    // update password
    const generatesalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(newPassword, generatesalt);
    user.password = encryptedPassword;
    await user.save();
    return res.status(201).json({
      success: true,
      userData: user,
      message: "Password changed Sucessfully.",
    });
  } catch (error) {
    console.log(error), res.json(error);
  }
};

//update the details of users

const updateUser = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const { firstName, lastName, address, phone } = req.body;
  const { userId }=req.params;
  const { image } = req.files;

  console.log(req.params)

  if ( !firstName || !lastName || !address || !phone) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const user = await Users.findOne({ _id: userId });

    if (user == null) {
      return res.json({
        success: false,
        message: "cannot find users.",
      });
    } 
    // if user data is same as it is before
    if (
      user.firstName === firstName &&
      user.lastName === lastName &&
      user.address === address &&
      user.phone === phone
       &&
      !image
    ) {
      return res.json({
        success: false,
        userData: user,
        message: "No changes made.",
      });
    }
    if (image) {
      const uploadImage = await cloudinary.v2.uploader.upload(image.path, {
        folder: "product",
        crop: "scale",
      });
      user.firstName = firstName;
      user.lastName = lastName;
      user.address = address;
      user.phone = phone;
      user.image = uploadImage.secure_url;

      await user.save();
      return res.json({
        success: true,
        userData: user,
        message: "User Updated Sucessfully.",
      });
    } else {
      user.firstName = firstName;
      user.lastName = lastName;
      user.address = address;
      user.phone = phone;
      await user.save();
      return res.json({
        success: true,
        userData: user,
        message: "User Details Updated Sucessfully.",
      });
    }
  } catch (error) {
    console.log(error), res.json(error);
  }
};

const updateUserMob = async (req, res) => {
  console.log(req.body);

  const { firstName, lastName, address, phone } = req.body;
  const { userId }=req.params;

  console.log(req.params)

  if ( !firstName || !lastName || !address || !phone) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const user = await Users.findOne({ _id: userId });

    if (user == null) {
      return res.json({
        success: false,
        message: "cannot find users.",
      });
    } 
    if (
      user.firstName === firstName &&
      user.lastName === lastName &&
      user.address === address &&
      user.phone === phone
    ) {
      return res.json({
        success: false,
        userData: user,
        message: "No changes made.",
      });
    }
      user.firstName = firstName;
      user.lastName = lastName;
      user.address = address;
      user.phone = phone;
      await user.save();
      return res.json({
        success: true,
        userData: user,
        message: "User Details Updated Sucessfully.",
      });
    
  } catch (error) {
    console.log(error), res.json(error);
  }
};
// count the total number of user in database
const countUsers = async (req, res) => {
  try {
    const count = await Users.countDocuments();
    return res.json({
      success: true,
      count: count,
      message: "Total number of users.",
    });
  } catch (error) {
    console.log(error), res.json(error);
  }
};
// count user in past 7 days
const countNewUsersInPast7Days = async (req, res) => {
  try {
    const currentDate = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const count = await Users.countDocuments({
      createdAt: { $gte: sevenDaysAgo, $lte: currentDate },
    });

    return res.json({
      success: true,
      count: count,
      message: "Number of users created in the past 7 days.",
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//  count only verified users
const countVerifiedUsers = async (req, res) => {
  try {
    const count = await Users.countDocuments({ isVerified: true });
    return res.json({
      success: true,
      count: count,
      message: "Total number of verified users.",
    });
  } catch (error) {
    console.log(error), res.json(error);
  }
};

//  get user growth in past 7 days
const getUserGrowthInPast7Days = async (req, res) => {
  try {
    const currentDate = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const userGrowthData = await Users.aggregate([
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
      data: userGrowthData,
      message: "User growth in the past 7 days.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  try {
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Generate OTP
    const otp = Math.floor(10000 + Math.random() * 90000);

    // Save OTP to user document
    user.otp = otp;
    await user.save();

    const emailSubject = "Forget Password";
    const emailText = ` Your OTP to reset password is: ${otp}. 
    Please use this OTP to reset your password. Thank you!`;

    await sendEmail(email, emailSubject, emailText);
    
    return res.json({
      success: true,
      message: "OTP has been sent to your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(req.body)
  try {
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the provided OTP matches the stored OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
    return res.json({
      success: true,
      message: "OTP Verified",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  try {
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const generatesalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, generatesalt);
    
    user.password = encryptedPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


// upload cv
const uploadCV = async (req, res) => {
  const { userId } = req.body;
  const { cvFile } = req.files;

  try {
    const user = await Users.findOne({ _id: userId });

    if (user == null) {
      return res.json({
        success: false,
        message: "cannot find users.",
      });
    }
    if (cvFile) {
      const uploadCV = await cloudinary.v2.uploader.upload(cvFile.path, {
        folder: "product",
        crop: "scale",
        resource_type: "raw",
      });
      user.cvFile = uploadCV.secure_url;

      await user.save();
      return res.json({
        success: true,
        userData: user,
        message: "CV Uploaded Sucessfully.",
      });
    }
  } catch (error) {
    console.log(error), res.json(error);
  }
};
module.exports = {
  createUser,
  loginUser,
  changePassword,
  updateUser,
  updateUserMob,
  countUsers,
  countNewUsersInPast7Days,
  countVerifiedUsers,
  getUserGrowthInPast7Days,
  forgetPassword,
  verifyOtp,
  resetPassword,
  uploadCV,
};
