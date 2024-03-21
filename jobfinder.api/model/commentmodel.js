const mongoose = require("mongoose");

const Comment=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'jobs',
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isVerified: {
        type: Boolean,
        default: false,
      },
})
 const CommentModel=mongoose.model('comment',Comment);
    module.exports=CommentModel;
