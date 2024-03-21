const CommentModel = require("../model/commentmodel");

const AddComment = async (req, res) => {
    const { userId, jobId, comment } = req.body;
    console.log(req.body);
    try {
        const newComment = new CommentModel({
        userId: userId,
        jobId: jobId,
        comment: comment,
        });
        const savedComment = await newComment.save();
        res.status(200).json({
        success: true,
        message: "Comment saved successfully.",
        data: savedComment,
        });
    } catch (err) {
        console.log(err);
        res.json({
        success: false,
        message: "Comment not saved.",
        errorMessage: err.message,
        });
    }
    }


const getCommentByJobId = async (req, res) => {
     const id = req.params.id;
     console.log(req.params.id);
    try {
        const recentComments = await CommentModel
        .find({ jobId: id })
        .populate("userId")
        // .populate("jobId")
        .sort({ createdAt: -1 })
        .limit(5);
        res.json({
        success: true,
        comment: recentComments,
        });
    } catch (err) {
        console.log(err);
        res.json({
        success: false,
        message: "Error in fetching all comment.",
        errorMessage: err.message,
        });
    }
    }
    module.exports = {AddComment,getCommentByJobId};