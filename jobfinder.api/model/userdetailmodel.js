const mongoose = require("mongoose");

const userDetailSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", 
        required: true,
    },
    dob: {
        type: String,
        // required: true,
      },
    fatherName: {
        type: String,
        required: true,
    },
    motherName: {
        type: String,
        required: true,
    },
    grandfatherName: {
        type: String,
        required: true,
    },
    grandmotherName: {
        type: String,
        required: true,
    },
    educationLevel: {
        type: String,
        required: true,
    },
    courseType: {
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    schoolName: {
        type: String,
        required: true,
    },
    educationBackground: {
        type: String,
        required: true,
    },
    recentJobTitle: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    employmentDuration: {
        type: Number,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    otherjobsDetail: {
        type: String,
        required: true,
    },


    });

const UserDetailModel = mongoose.model("userdetails", userDetailSchema);
module.exports = UserDetailModel;
