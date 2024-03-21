const mongoose = require('mongoose');

const jobsSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    jobTitle:{
        type:String,
        required:true,
    },
    companyName:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    jobType:{
        type:String,
        required:true,
    },
    experianceLevel:{
        type:String,
        required:true,
    },
    educationLevel:{
        type:String,
        required:true,
    
    },
    jobDescription:{
        type:String,
        required:true,
    },
    jobResponsibilities:{
        type:String,
        required:true,
    },
    salary:{
        type:String,
        required:true,
    },
    companyOverview:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
    },
    workType:{
        type:String,
        required:true,
    },
    jobTags:{
        type:Array,
        // required:true,
    },
    category:{
        type:String,
        // required:true,
    },
    applyBefore:{
        type:Date,
        // required:true,
    },
    image:{
        type:String,
        // required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    
});

const Jobs= mongoose.model('jobs',jobsSchema);
module.exports=Jobs;