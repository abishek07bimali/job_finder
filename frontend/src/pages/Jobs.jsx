import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllJobsApi, getAllJobsWithoutSavedApi, postLikedJobsApi } from "../api/api";

const Jobs = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [favoritedJobs, setFavoritedJobs] = useState([]);
  const [jobItems, setJobItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleHeartClick = async (jobId) => {
    if (!user) {
      openModal();
      return;
    }

    try {
      // Send the liked job to the backend
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("likedJobsId", jobId);

      const response = await postLikedJobsApi(formData);
      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        getAllJobsWithoutSavedApi(user._id)
        .then((res) => {
          setJobItems(res.data.jobs); // Update jobItems state with the updated list of jobs
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      }
      console.log("Liked job sent to backend:", response.data);
    } catch (error) {
      console.error("Error sending liked job to backend:", error.message);
    }

    // Update the favoritedJobs state with the new liked job
    setFavoritedJobs([...favoritedJobs, jobId]);
  };

  const handleOk = () => {
    closeModal();
    navigate("/login");
  };

 useEffect(() => {
    if(user == null) {
      getAllJobsApi()
      .then((res) => {
        setJobItems(res.data.jobs);
        setLoading(false);
        // console.log(res.data.jobs);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    
    }
    else{
      getAllJobsWithoutSavedApi(user._id)
      .then((res) => {
        setJobItems(res.data.jobs);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }}, []);

  return (
    <div className="">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3 className="text-2xl font-bold mb-2 ml-6 mt-4 text-green-500 text-center">
            All Jobs
          </h3>
          <div className="w-full flex-1 p-4 flex flex-wrap justify-center">
            {jobItems.map((job, index) => (
              <div
                key={index}
                className="bg-green-100 sm:w-full md:w-1/3 flex p-4 m-2 justify-between items-center border rounded"
              >
                <div
                  className="flex w-4/5"
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="rounded w-1/5 items-center">
                    <img src={job.image} alt="" width={50} />
                  </div>
                  <div className="items-center flex-col w-3/5 pl-4">
                    <h3 className="text-xl items-center font-semibold ">
                      {job.jobTitle} -
                      <p className="text-sm text-red-500 text-transform: capitalize">
                        {job.jobType}
                      </p>
                    </h3>
                    <p>{` ${job.companyName}`}</p>
                  </div>
                </div>
                <i
                  className={`fa-regular fa-heart ml-5 ${
                    favoritedJobs.includes(job._id) ? "fas" : ""
                  }`}
                  onClick={() => handleHeartClick(job._id)}
                ></i>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isModalOpen && (
        <div
          className="fixed inset-0 grid place-items-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative mx-auto p-5 border max-w-2xl w-4/5 shadow-lg rounded-md bg-white">
            {/* Close button */}
            <div className="absolute top-2 right-2 ">
              <button
                onClick={closeModal}
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-lg text-sm "
              >
                <i class="fa-solid fa-xmark p-2"></i>
              </button>
            </div>

            {/* Message and OK button */}
            <div className="text-center mt-5">
              <p className="text-lg mb-4">
                Please login before continuing further.
              </p>
              <button
                onClick={handleOk}
                className="bg-green-500 w-1/5 text-white font-bold py-2 px-4 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
