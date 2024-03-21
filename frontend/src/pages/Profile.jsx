import userEvent from "@testing-library/user-event";
import React, { useEffect, useRef, useState } from "react";
import {
  getApplicationbyId,
  getAppliedJobsApi,
  getLikedJobsApi,
  postLikedJobsApi,
  updatePassword,
  updateUserDetail,
  uploadCv,
} from "../api/api";
import logo from "../images/logos/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("userDetail");
  const [editMode, setEditMode] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [oldImage, setOldImage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [jobSavedItems, setJobSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // model open andclose start
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
    const [loadingSave, setLoadingsave] = useState(false);
    const [loadingSaveCV, setLoadingsaveCV] = useState(false);


  // const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  // const openPasswordModal = () => setIsPasswordModalOpen(true);
  // const closePasswordModal = () => setIsPasswordModalOpen(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDOB] = useState("");

  // check user is verified or not and display the new button in place of Download Button
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (user.isVerified === true) {
      setIsVerified(true);
    }
  }, [user.isVerified]);

  const navigate = useNavigate();

  const openModalOnClick = () => {
    openModal();
  };

  const handleOk = () => {
    closeModal();
    handleLogout();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleEditModeToggle = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone);
    setAddress(user.address);
    setDOB(user.dob);
    setEditMode(!editMode);
  };

  useEffect(() => {
    getLikedJobsApi(user._id)
      .then((res) => {
        setJobSavedItems(res.data.likedJobsDetails);
        setLoading(false);
        console.log(res.data.likedJobsDetails);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const [appliedJobs, setAppliedJobs] = useState([]);

  //  get application by user id
  useEffect(() => {
    getAppliedJobsApi(user._id)
      .then((res) => {
        setAppliedJobs(res.data.applications);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // get all jobs id in model
  const [jobDetails, setJobDetails] = useState(null);
  const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false);
  const openVerificationModal = () => {
    setisVerificationModalOpen(true);
  };

  const closeVerificationModal = () => setisVerificationModalOpen(false);

  const alertDescription = (id) => {
    const job = appliedJobs.find((jobs) => jobs._id === id);
    setJobDetails(job);
    openVerificationModal();
  };

  const openPasswordModalOnClick = () => {
    handlePasswordUpdate();

    // openPasswordModal();
  };

  // const handlePassword = () => {
  //   closePasswordModal();
  // };

  //   change password
  const handlePasswordUpdate = () => {
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    if (newPassword !== verifyPassword) {
      toast.error("New Password and Verify Password does not match");
      return;
    }

    updatePassword(formData).then((res) => {
      if (res.data.success == false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        window.location.reload();
      }
    });
  };

  //   handle user detail change
  const handleUserDetailChange = () => {
    console.log(profileImage);
    setLoadingsave(true);
    const formdata = new FormData();
    formdata.append("userId", user._id);
    formdata.append("firstName", firstName);
    formdata.append("lastName", lastName);
    formdata.append("phone", phone);
    formdata.append("address", address);
    formdata.append("dob", dob);
    formdata.append("image", profileImage);

    updateUserDetail(user._id, formdata).then((res) => {
      if (res.data.success == false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        const updatedUser = {
          ...user,
          firstName,
          lastName,
          phone,
          address,
          image: res.data.userData.image,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        handleEditModeToggle();
        setLoadingsave(false);

      }
    });
  };

  const cvInputRef = useRef(null);
  const handleCVUpload = () => {
    cvInputRef.current.click();
  };

  const handleCVFileChange = (e) => {
    const selectedFile = e.target.files[0];
        setLoadingsaveCV(true);
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        console.log("File is a PDF:", selectedFile);

        const formData = new FormData();
        formData.append("userId", user._id);
        formData.append("cvFile", selectedFile);

        // Perform API call to send the PDF file to the server
        // Example:
        uploadCv(formData)
          .then((res) => {
            if (res.data.success == false) {
              toast.error(res.data.message);
            } else {
              toast.success(res.data.message);
              const updatedUser = {
                ...user,
                cvFile: res.data.userData.cvFile,
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              window.location.reload();
            }
          })
          .catch((error) => {
            toast.error("server error");
          }) .finally(() => {
            setLoadingsaveCV(false);
          });
      } else {
        toast.error("Please select a PDF file.");
      }
    }
  };
  // handle unsave /unlike the favorite jobs
  const [favoritedJobs, setFavoritedJobs] = useState([]);

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
            getLikedJobsApi(user._id)
            .then((res) => {
              setJobSavedItems(res.data.likedJobsDetails);
              setLoading(false);
              console.log(res.data.likedJobsDetails);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
            
            // Update the favoritedJobs state with the new liked job
            setFavoritedJobs([...favoritedJobs, jobId]);
        }
        console.log("Liked job sent to backend:", response.data);
    } catch (error) {
        console.error("Error sending liked job to backend:", error.message);
    }
};


  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-md overflow-hidden shadow-md">
        <div className="bg-green-500 flex justify-between items-center p-4">
          <h2 className="text-white text-lg font-semibold">
            Welcome {user.firstName}
          </h2>
          <button className="text-white" onClick={openModalOnClick}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-center mb-4">
            <label htmlFor="profileImage" className="cursor-pointer">
              <img
                src={previewImage || user.image || logo}
                alt="User Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-green-500 cursor-pointer"
                onClick={() =>
                  editMode &&
                  document.getElementById("profileImageInput").click()
                }
              />
            </label>
            {editMode && (
              <input
                type="file"
                id="profileImageInput"
                className="hidden"
                onChange={handleImageChange}
              />
            )}
          </div>
          {isVerified ? (
            <div className="text-center m-5">
              <input
                type="file"
                id="cvFile"
                ref={cvInputRef}
                style={{ display: "none" }}
                onChange={handleCVFileChange}
                accept=".pdf"
              />
              {user.cvFile ? (
                <>
                  <button
                    onClick={handleCVUpload}
                    className="bg-green-500 text-white py-2 px-4 mb-4 rounded w-1/3"
                  >
                   
                    {loadingSaveCV ? "Saving CV..." : " Update CV"}

                  </button>
                  <div>
                    <a
                      href={user.cvFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="mr-5 ">View CV:</span>

                      <i className="fa-solid fa-file-pdf text-red-500 cursor-pointer"></i>
                    </a>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleCVUpload}
                  className="bg-green-500 text-white py-2 px-4 mb-4 rounded w-1/3"
                >
                  Upload CV
                </button>
              )}
            </div>
          ) : (
            <div className="text-center m-5">
              <Link
                to={"/user/verify"}
                className="bg-red-500 text-white py-2 px-4 mb-4 rounded w-1/3"
              >
                Verify Account
              </Link>
            </div>
          )}

          {/* Tabs */}
          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 px-4 ${
                activeTab === "userDetail"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handleTabChange("userDetail")}
            >
              User Detail
            </button>
            <button
              className={`flex-1 py-2 px-4 ${
                activeTab === "changePassword"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handleTabChange("changePassword")}
            >
              Password
            </button>
            <button
              className={`flex-1 py-2 px-4 ${
                activeTab === "savedJobs"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handleTabChange("savedJobs")}
            >
              Saved Jobs
            </button>
            <button
              className={`flex-1 py-2 px-4 ${
                activeTab === "appliedJobs"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handleTabChange("appliedJobs")}
            >
              Applied
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === "userDetail" && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                User Detail
              </h3>
              {editMode ? (
                <>
                  <label className="block mb-4">
                    <span className="text-sm text-gray-600">First Name:</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-input mt-1 block w-full"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-sm text-gray-600">Last Name:</span>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-input mt-1 block w-full"
                    />
                  </label>
                  <label
                    className={`block mb-4  ${editMode ? "hidden" : "block"}`}
                  >
                    <span className="text-sm text-gray-600">Email:</span>
                    <input
                      type="email"
                      className="form-input mt-1 block w-full"
                      value={user.email}
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-sm text-gray-600">Phone :</span>
                    <input
                      type="tel"
                      className="form-input mt-1 block w-full"
                      onChange={(e) => setPhone(e.target.value)}
                      value={phone}
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-sm text-gray-600">Address:</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      onChange={(e) => setAddress(e.target.value)}
                      value={address}
                    />
                  </label>
                  {/* Add more user information fields as needed */}
                </>
              ) : (
                // View mode
                <>
                  <p className="text-sm text-gray-600 font-semibold mb-4">
                    Name: {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 font-semibold mb-4">
                    Email: {user.email}
                  </p>
                  <p className="text-sm text-gray-600 font-semibold mb-4">
                    Phone: {user.phone}
                  </p>
                  <p className="text-sm text-gray-600 font-semibold mb-4">
                    Address: {user.address}
                  </p>
                  {/* Add more user information fields as needed */}
                </>
              )}

              {/* Edit Profile Button */}
              <button
                className={`bg-green-500 text-white py-2 px-4 mb-4 rounded w-full ${
                  editMode ? "hidden" : "block"
                }`}
                onClick={handleEditModeToggle}
              >
                Edit Profile
              </button>

              {/* Save Profile Button */}
              {editMode && (
                <button
                  className="bg-green-500 text-white py-2 px-4 mb-4 rounded w-full"
                  onClick={handleUserDetailChange}
                >
                  {loadingSave ? "Saving..." : " Save Profile"}

                </button>
              )}
            </div>
          )}

          {activeTab === "changePassword" && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Change Password
              </h3>
              {/* {editMode && ( */}
              <>
                <label className="block mb-2">
                  <span className="text-sm text-gray-600">
                    Current Password:
                  </span>
                  <input
                    type="password"
                    className="form-input mt-1 block w-full"
                    placeholder="Enter current password"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-sm text-gray-600">New Password: </span>
                  <input
                    type="password"
                    className="form-input mt-1 block w-full"
                    placeholder="Enter new password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-sm text-gray-600">
                    Verify Password:
                  </span>
                  <input
                    type="password"
                    className="form-input mt-1 block w-full"
                    placeholder="Verify new password"
                    onChange={(e) => setVerifyPassword(e.target.value)}
                  />
                </label>
                <button
                  onClick={openPasswordModalOnClick}
                  className="bg-green-500 py-2 px-4 rounded text-white items-center w-full mt-4 "
                >
                  Change Password
                </button>
              </>
            </div>
          )}

          {activeTab === "savedJobs" && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Saved Jobs
              </h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="w-full flex-1 p-4 flex flex-wrap">
                  {jobSavedItems.map((job, index) => (
                    <div
                      key={index}
                      className="bg-green-100 sm:w-full flex p-4 m-2 justify-between items-center border rounded"
                    >
                      <div
                        className="flex "
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="rounded w-1/5 items-center">
                          <img
                            src={job.image}
                            alt=""
                            className="rounded"
                            height={50}
                            width={50}
                          />
                        </div>
                        <div className="items-center flex-col w-4/5 pl-4">
                          <h3 className="text-xl items-center font-semibold ">
                            {job.jobTitle}
                          </h3>
                          <p>{`Company: ${job.companyName}`}</p>
                        </div>
                      </div>
                      <i
                        className={`fa-solid fa-heart ml-5 text-green-500 ${
                          favoritedJobs.includes(job._id) ? "fas" : ""
                        }`}
                        onClick={() => {
                          handleHeartClick(job._id);
                          // window.location.reload();
                        }}
                      ></i>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "appliedJobs" && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Applied Jobs
              </h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="w-full flex-1 p-4 flex flex-wrap">
                  {appliedJobs.slice(0, 6).map((job, index) => (
                    <div
                      key={index}
                      className="bg-green-100 sm:w-full flex p-4 m-2 justify-between items-center border rounded"
                    >
                      <div
                        className=" flex"
                        onClick={() => navigate(`/jobs/${job.jobsId._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="rounded w-1/5 items-center">
                          <img
                            src={job.jobsId.image}
                            alt=""
                            className="rounded"
                            height={50}
                            width={50}
                          />
                        </div>
                        <div className="items-center flex-col w-4/5 pl-4">
                          <h3 className="text-xl items-center font-semibold ">
                            {job.jobsId.jobTitle}
                          </h3>
                          <p>{`Company: ${job.jobsId.companyName}`}</p>
                        </div>
                      </div>
                      {job.isVerified ? (
                        <h3
                          className=" bg-green-500 py-1 px-2 rounded text-white"
                          title={job.interview}
                          onClick={() => alertDescription(job._id)}
                        >
                          Verified
                        </h3>
                      ) : job.isRejected ? (
                        <h3
                          className=" bg-red-500 text-white rounded py-1 px-2 "
                          title="Your Application has been Rejected."
                          onClick={() => alertDescription(job._id)}
                        >
                          {" "}
                          Rejected
                        </h3>
                      ) : (
                        <h3
                          className=" bg-yellow-500 text-white rounded py-1 px-2 "
                          title="Your application has not been verified yet"
                          onClick={() => alertDescription(job._id)}
                        >
                          {" "}
                          Pending
                        </h3>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 grid place-items-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative mx-auto p-5 border max-w-2xl w-4/5 shadow-lg rounded-md bg-white">
            {/* Close button */}
            <div className="absolute top-2 right-2">
              <button
                onClick={closeModal}
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                <i className="fa-solid fa-xmark p-2"></i>
              </button>
            </div>

            <div className="text-center mt-5">
              <div className="mb-4">
                <i className="fa-solid fa-info-circle text-red-500 text-4xl mb-2"></i>
                {/* User information text */}
                <p className="text-lg mb-4">Are you sure you want to logout?</p>
              </div>

              {/* OK button */}
              <button
                onClick={handleOk}
                className="bg-red-500 w-1/5 text-white font-bold py-2 px-4 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {isPasswordModalOpen && (
        <div
          className="fixed inset-0 grid place-items-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative mx-auto p-5 border max-w-2xl w-4/5 shadow-lg rounded-md bg-white">
            <div className="absolute top-2 right-2">
              <button
                onClick={closePasswordModal}
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                <i className="fa-solid fa-xmark p-2"></i>
              </button>
            </div>

            <div className="text-center mt-5">
              <div className="mb-4">
                <i className="fa-solid fa-info-circle text-yellow-500 text-4xl mb-2"></i>
                <p className="text-lg mb-4">
                  Are you sure you want to change password?
                </p>
              </div>

              <button
                onClick={handlePassword}
                className="bg-red-500 w-1/5 text-white font-bold py-2 px-4 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )} */}

      {isVerificationModalOpen && (
        <div
          className="fixed inset-0 grid place-items-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative mx-auto p-5 border max-w-2xl w-4/5 shadow-lg rounded-md bg-white">
            {/* Close button */}
            <div className="absolute top-2 right-2">
              <button
                onClick={closeVerificationModal}
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                <i className="fa-solid fa-xmark p-2"></i>
              </button>
            </div>

            {jobDetails && (
              <>
                {jobDetails.isVerified ? (
                  <div className="text-center mt-5">
                    <div className="mb-4"></div>
                    <div className="text-center mt-5">
                      <div className="mb-4">
                        <i className="fa-solid fa-info-circle text-green-500 text-4xl mb-2"></i>
                        <div className="text-center mt-5">
                          <div className="flex justify-center items-center mb-5">
                            <div className="mr-5 text-center">
                              <h3 className="">
                                {" "}
                                Hello{" "}
                                <strong className="text-green-500">
                                  {jobDetails.userId.firstName}
                                </strong>
                              </h3>
                              <hr />
                              <div className="">
                                <p>
                                  The application has been approved for the{" "}
                                  {jobDetails.jobsId.jobTitle} and the date for
                                  the{" "}
                                </p>
                                <p>
                                  interview is scheduled for:{" "}
                                  {jobDetails.interview}.{" "}
                                </p>
                                <p>
                                  You have been emailed at :{" "}
                                  {jobDetails.userId.email}.{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={closeVerificationModal}
                      className="bg-green-500 w-1/5 text-white font-bold py-2 px-auto rounded"
                    >
                      OK
                    </button>
                  </div>
                ) : jobDetails.isRejected ? (
                  <>
                    <div className="text-center mt-5">
                      <div className="mb-4"></div>
                      <div className="text-center mt-5">
                        <div className="mb-4">
                          <i className="fa-solid fa-info-circle text-red-500 text-4xl mb-2"></i>
                          <div className="text-center mt-5">
                            <div className="flex justify-center items-center mb-5">
                              <div className="mr-5 text-left">
                                <p>Your Application has been rejected.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={closeVerificationModal}
                        className="bg-red-500 w-1/5 text-white font-bold py-2 px-auto rounded"
                      >
                        OK
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mt-5">
                      <div className="mb-4"></div>
                      <div className="text-center mt-5">
                        <div className="mb-4">
                          <i className="fa-solid fa-info-circle text-yellow-500 text-4xl mb-2"></i>
                          <div className="text-center mt-5">
                            <div className="flex justify-center items-center mb-5">
                              <div className="mr-5 text-left">
                                <p>
                                  Your Application has not been verified yet.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={closeVerificationModal}
                        className="bg-yellow-500 w-1/5 text-white font-bold py-2 px-auto rounded"
                      >
                        OK
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
