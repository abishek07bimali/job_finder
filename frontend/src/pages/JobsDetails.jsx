// JobDetails.js

import React, { useEffect, useState } from "react";
import logo from "../images/logos/logo.png";
import {
  applyJobsApi,
  getCommentByJobIdApi,
  getJobsbyId,
  getRecommendedJobsApi,
  saveCommentsApi,
} from "../api/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { set } from "date-fns";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [jobDetails, setJobDetails] = useState({});
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // const jobsTags = { jobTags: ["React", "Node.js", "JavaScript"] };
  useEffect(() => {
    getJobsbyId(id)
      .then((res) => {
        setLoading(false);
        setJobDetails(res.data.jobs);
      })
      .catch((err) => {
        setLoading(true);
        console.log(err);
      });
  }, [id]);

  //   get Recommended Jobs by user ID
  useEffect(() => {
    // Check if user is not null before accessing _id
    if (user?.isVerified) {
      getRecommendedJobsApi(user._id)
        .then((res) => {
          setRecommendedJobs(res.data.recommendedJobs);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user?.isVerified, user?._id]);

  // apply jobs application
  const applyJob = (e, applyBeforeDate) => {
    e.preventDefault();

    const today = new Date();

    if (today > new Date(applyBeforeDate)) {
      return toast.warning(
        "You cannot apply for the job as the deadline has passed."
      );
    }

    const data = {
      userId: user._id,
      jobsId: id,
    };

    if (!user.cvFile) {
      return toast.error("Upload the CV from your profile section.");
    }
    applyJobsApi(data)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          // navigate('/user/profile');
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Comment/Review
  const [newComment, setNewComment] = useState("");

  const handleInputChange = (event) => {
    setNewComment(event.target.value);
  };

  const handlePostComment = () => {
    const data = {
      userId: user._id,
      jobId: id,
      comment: newComment,
    };
    saveCommentsApi(data).then((res) => {
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        setNewComment("");
        window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const [comments, setComments] = useState([]);

  // Fetch comments by job ID
  useEffect(() => {
    getCommentByJobIdApi(id)
      .then((res) => {
        setComments(res.data.comment);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className="bg-gray-100">
      <div className="max-w-screen-xl mx-auto p-8 bg-white shadow-lg rounded-lg flex flex-wrap justify-around">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-3/5">
            <h2 className="text-4xl font-bold mb-3 text-green-500">
              {jobDetails.jobTitle}
            </h2>
            <div className="flex">
              <p className="text-lg flex  font-semibold mb-2 text-gray-700">
                {jobDetails.companyName}{" "}
              </p>
              <p className="text-lg ml-3 text-green-600  font-bold text-transform: capitalize">
                {jobDetails.jobType}
              </p>
            </div>

            {/* <p className="text-sm ml-3 text-green-600 font-bold text-transform: capitalize">
   Created At: {new Date(jobDetails.createdAt).toLocaleDateString()} 
  </p> */}
            <img
              src={jobDetails.image}
              alt="Job Image"
              height={200}
              width={200}
              className="max-w-full h-auto mt-4 mb-4 p-4 rounded-md"
            />

            <div className="mb-4">
              <p className="text-sm text-green-500">
                {" "}
                <i class="fa-solid fa-calendar-days"></i> Apply Before:
              </p>
              <p className="text-gray-800">
                {new Date(jobDetails.applyBefore).toLocaleDateString()}{" "}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-green-500">
                {" "}
                <i class="fa-solid fa-location-dot pr-1"></i> Location:
              </p>
              <p className="text-gray-800">{jobDetails.location}</p>
            </div>

            <div>
              <div className="mb-4">
                <p className="text-sm text-green-500">
                  {" "}
                  <i class="fa-solid fa-clock pr-1"></i> Experience Level:
                </p>
                <p className="text-gray-800">{jobDetails.experianceLevel}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-green-500">
                  {" "}
                  <i class="fa-solid fa-graduation-cap pr-1"></i>Education
                  Level:
                </p>
                <p className="text-gray-800">{jobDetails.educationLevel}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-green-500">
                  <i class="fa-solid fa-circle-info pr-1"></i> Job Description:
                </p>
                <p className="text-gray-800">{jobDetails.jobDescription}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-green-500">
                  <i class="fa-solid fa-shield-halved pr-1"></i> Job
                  Responsibility:
                </p>
                <p className="text-gray-800">
                  {jobDetails.jobResponsibilities}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-green-500">
                  {" "}
                  <i class="fa-solid fa-address-book pr-1"></i>Salary:
                </p>
                <p className="text-gray-800">{jobDetails.salary}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-green-500">
                  {" "}
                  <i class="fa-solid fa-phone pr-1"></i>Contact:
                </p>
                <p className="text-gray-800">{jobDetails.contact}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-green-500">
                  <i class="fa-solid fa-briefcase pr-1"></i>Remote Work Options:
                </p>
                <p className="text-gray-800">{jobDetails.workType}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-green-500">
                  <i class="fa-solid fa-circle-info pr-1"></i>Company Overview:
                </p>
                <p className="text-gray-800">{jobDetails.companyOverview}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-green-500">
                  <i class="fa-solid fa-tag pr-1"></i> Job Tags:
                </p>
                <ul className="list-disc pl-6">
                  {jobDetails.jobTags.map((tag, index) => (
                    <li key={index} className="text-gray-800">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {!user ? (
              <>
                <Link to="/login" className="text-red-500">
                  Please login to Apply for job.
                </Link>
              </>
            ) : user.isVerified ? (
              <button
                // to={`/apply/${jobDetails._id}`}
                onClick={(e) => applyJob(e, jobDetails.applyBefore)}
                className="bg-green-500 rounded w-full p-2 text-white font semibold"
              >
                Apply
              </button>
            ) : (
              <Link to="/user/profile" className="text-red-500">
                User is not verified. Please verify your account to apply for
                jobs.
              </Link>
            )}
          </div>
        )}
        <div>
          <div className="p-8 max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-green-500">
              Recommended Jobs
            </h3>
            {user == null ? (
              <Link to="/login" className="text-red-500">
                Please login to view recommended jobs.
              </Link>
            ) : user && user.isVerified ? (
              recommendedJobs && recommendedJobs.length > 0 ? (
                recommendedJobs.slice(0, 4).map((recommendation, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 mb-4 shadow-md rounded-md flex  items-center"
                  >
                    <div>
                      <img
                        src={recommendation.image}
                        alt="Job Image"
                        height={50}
                        width={50}
                        className="max-w-full h-auto"
                      />
                    </div>
                    <div className="ml-2">
                      <h4 className="text-lg font-semibold mb-2">
                        {recommendation.jobTitle}
                      </h4>
                      <p className="text-gray-700">
                        {recommendation.companyName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recommended jobs available.</p>
              )
            ) : (
              <Link to="/user/profile" className="text-red-500">
                User is not verified. Recommended jobs are only available for
                verified users.
              </Link>
            )}
          </div>
          {/* comnet  */}

          <div className="p-8 max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-green-500">
              Comment/Review
            </h3>

            <div className="mb-4 ">
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex text-left bg-gray-100 rounded m-1 "
                  >
                    <div className="w-1/9">
                      <img
                        src={comment.userId.image}
                        height={30}
                        width={30}
                        alt=""
                        className="rounded-full"
                      />
                    </div>
                    <div className="bg-gray-100 text-left p-2 rounded mb-2">
                      {comment.comment}
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments available.</p>
              )}
            </div>

            {/* Input box for new comment */}
            {!user ? null : (
              <div>
                <textarea
                  className="w-full h-16 p-2 border rounded mb-4"
                  placeholder="Type your comment..."
                  value={newComment}
                  onChange={handleInputChange}
                ></textarea>

                {/* Button to post comment */}
                <button
                  className="bg-green-500 text-white  py-2 px-4 rounded"
                  onClick={handlePostComment}
                >
                  Post Comment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
