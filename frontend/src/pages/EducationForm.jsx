// VerificationScreen.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addUserdetailApi } from "../api/api";

const VerificationScreen = () => {
  const [activeTab, setActiveTab] = useState(1);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  const [formData, setFormData] = useState({
    // Initial form data
    userId,
    dob: "",
    fatherName: "",
    motherName: "",
    grandfatherName: "",
    grandmotherName: "",
    educationLevel: "",
    courseType: "",
    courseName: "",
    schoolName: "",
    educationBackground: "",
    recentJobTitle: "",
    jobType: "",
    employmentDuration: "",
    companyName: "",
    otherjobsDetail: "",

    // Add fields for education and employment data as needed
  });

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleNext = () => {
    setActiveTab(activeTab + 1);
  };

  const handleBack = () => {
    setActiveTab(activeTab - 1);
  };

  const ProgressBar = ({ step, onStepClick }) => {
    const steps = ["Basic Info", "Education", "Employment", "Summary"];

    return (
      <div className="flex justify-between mb-4 relative">
        {steps.map((label, index) => (
          <div key={index} className="text-center relative w-2/6">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 cursor-pointer ${
                index < step
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-300"
              }`}
              onClick={() => onStepClick(index)}
            >
              {index + 1}
            </div>
            {index < steps.length && (
              <div
                className={`absolute left-0 top-8 h-0.5 bg-gray-300 w-full ${
                  index < step ? "bg-green-500" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const BasicInfoForm = ({ onNext, onInputChange, formData }) => {
    const [fatherName, setFatherName] = useState("");
    const [motherName, setMotherName] = useState("");
    const [grandfatherName, setGrandfatherName] = useState("");
    const [grandmotherName, setGrandmotherName] = useState("");
    const [dob, setDob] = useState("");

    // use state for error message
    const [dobError, setDobError] = useState("");
    const [FathernameError, setFathernameError] = useState("");
    const [MothernameError, setMothernameError] = useState("");
    const [GrandfathernameError, setGrandfathernameError] = useState("");
    const [GrandmothernameError, setGrandmothernameError] = useState("");

    const validate = () => {
      let isvalid = true;

      // reset error message
      //   setFathernameError("");
      //   setMothernameError("");
      //   setGrandfathernameError("");
      //   setGrandmothernameError("");

      if (dob.trim() === "") {
        setDobError("Father name is required");
        isvalid = false;
      }
      if (fatherName.trim() === "") {
        setFathernameError("Father name is required");
        isvalid = false;
      }
      if (motherName.trim() === "") {
        setMothernameError("Mother name is required");
        isvalid = false;
      }
      if (grandfatherName.trim() === "") {
        setGrandfathernameError("Grandfather name is required");
        isvalid = false;
      }
      if (grandmotherName.trim() === "") {
        setGrandmothernameError("Grandmother name  is required");
        isvalid = false;
      }

      return isvalid;
    };

    const nextClick = (e) => {
      e.preventDefault();
      const isValid = validate();
      if (!isValid) {
        return false;
      }
      handleInputChange("dob", dob);
      handleInputChange("fatherName", fatherName);
      handleInputChange("motherName", motherName);
      handleInputChange("grandfatherName", grandfatherName);
      handleInputChange("grandmotherName", grandmotherName);
      onNext();
    };

    return (
      <div className="">
        <ProgressBar step={1} />

        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Basic Information
          </h1>
          <div className="mb-4">
            <label
              htmlFor="dob"
              className="block text-gray-600 text-sm font-semibold mb-2"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              onChange={(e) => {
                setDob(e.target.value);
                setDobError("");
              }}
              className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500  ${
                dobError ? "border-red-500" : ""
              }`}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="fatherName"
              className="block text-sm font-medium text-gray-600"
            >
              Father Name
            </label>
            <input
              type="text"
              id="fatherName"
              placeholder="Enter Father's Name"
              className={`mt-1 p-2 border rounded-md w-full ${
                FathernameError ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setFatherName(e.target.value);
                setFathernameError("");
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="motherName"
              className="block text-sm font-medium text-gray-600"
            >
              Mother Name
            </label>
            <input
              type="text"
              id="motherName"
              placeholder="Enter Mother's Name"
              className={`mt-1 p-2 border rounded-md w-full ${
                MothernameError ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setMotherName(e.target.value);
                setMothernameError("");
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="grandfatherName"
              className="block text-sm font-medium text-gray-600"
            >
              Grandfather Name
            </label>
            <input
              type="text"
              id="grandfatherName"
              placeholder="Enter Grandfather's Name"
              className={`mt-1 p-2 border rounded-md w-full ${
                GrandfathernameError ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setGrandfatherName(e.target.value);
                setGrandfathernameError(""); // Clear the error when the user starts typing
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="grandmotherName"
              className="block text-sm font-medium text-gray-600"
            >
              Grandmother Name
            </label>
            <input
              type="text"
              id="grandmotherName"
              placeholder="Enter Grandmother's Name"
              className={`mt-1 p-2 border rounded-md w-full ${
                GrandmothernameError ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setGrandmotherName(e.target.value);
                setGrandmothernameError(""); // Clear the error when the user starts typing
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={nextClick}
            className="bg-green-500 text-white p-2 rounded w-2/5 "
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const EducationForm = ({ onNext, onBack, onInputChange, formData }) => {
    const [educationLevel, setEducationLevel] = useState("");
    const [courseType, setCourseType] = useState("");
    const [courseName, setCourseName] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [educationBackground, setEducationBackground] = useState("");

    // erroe message vetidation
    const [educationLevelError, setEducationLevelError] = useState("");
    const [courseTypeError, setCourseTypeError] = useState("");
    const [courseNameError, setCourseNameError] = useState("");
    const [schoolNameError, setSchoolNameError] = useState("");
    const [educationBackgroundError, setEducationBackgroundError] =
      useState("");

    // validation function
    const validate = () => {
      let isvalid = true;

      // reset error message

      if (educationLevel.trim() === "") {
        setEducationLevelError("Education Level is required");
        isvalid = false;
      }
      if (courseType.trim() === "") {
        setCourseTypeError("Course Type is required");
        isvalid = false;
      }
      if (courseName.trim() === "") {
        setCourseNameError("Course Name is required");
        isvalid = false;
      }
      if (schoolName.trim() === "") {
        setSchoolNameError("School Name is required");
        isvalid = false;
      }
      if (educationBackground.trim() === "") {
        setEducationBackgroundError("Education Background is required");
        isvalid = false;
      }
      return isvalid;
    };

    const nextClick = (e) => {
      e.preventDefault();
      const isValid = validate();
      if (!isValid) {
        return false;
      }
      handleInputChange("educationLevel", educationLevel);
      handleInputChange("courseType", courseType);
      handleInputChange("courseName", courseName);
      handleInputChange("schoolName", schoolName);
      handleInputChange("educationBackground", educationBackground);

      onNext();
    };

    return (
      <div>
        <ProgressBar step={2} />
        <h1 className="text-2xl font-bold mb-4 text-center">
          Education History
        </h1>

        <div className="mb-4">
          <label
            htmlFor="educationLevel"
            className="block text-sm font-medium text-gray-600"
          >
            Education Level
          </label>
          <select
            className={`mt-1 p-2 border rounded-md w-full ${
              educationLevelError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setEducationLevel(e.target.value);
              setEducationLevelError("");
            }}
          >
            <option value="" disabled selected>
              Select Education Level
            </option>
            <option value="highSchool">High School</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="courseType"
            className="block text-sm font-medium text-gray-600"
          >
            Course Type {courseType}
          </label>
          <select
            className={`mt-1 p-2 border rounded-md w-full ${
              courseTypeError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setCourseType(e.target.value);
              setCourseTypeError("");
            }}
          >
            <option value="" disabled selected>
              Select Course Type
            </option>
            <option value="science">Science</option>
            <option value="arts">Arts</option>
            <option value="commerce">Commerce</option>
            <option value="engineering">Engineering</option>
            <option value="medicine">Medicine</option>
            <option value="law">Law</option>
            <option value="computer science">Computer Science</option>
            <option value="business administration">
              Business Administration
            </option>
            <option value="education">Education</option>
            <option value="architecture">Architecture</option>
            <option value="psychology">Psychology</option>
            <option value="nursing">Nursing</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="social work">Social Work</option>
            <option value="journalism">Journalism</option>
            <option value="graphic design">Graphic Design</option>
            <option value="environmental science">Environmental Science</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="courseName"
            className="block text-sm font-medium text-gray-600"
          >
            Course Name
          </label>
          <input
            type="text"
            value={courseName}
            placeholder="Enter the name of your course"
            className={`mt-1 p-2 border rounded-md w-full ${
              courseNameError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setCourseName(e.target.value);
              setCourseNameError("");
            }}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="schoolName"
            className="block text-sm font-medium text-gray-600"
          >
            School/University Name
          </label>
          <input
            type="text"
            id="schoolName"
            placeholder="Enter the name of your school/university"
            className={`mt-1 p-2 border rounded-md w-full ${
              schoolNameError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setSchoolName(e.target.value);
              setSchoolNameError("");
            }}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="educationBackground"
            className="block text-sm font-medium text-gray-600"
          >
            Education Background
          </label>
          <textarea
            rows={3}
            id="educationBackground"
            placeholder="Describe your education background..."
            className={`mt-1 p-2 border rounded-md w-full ${
              educationBackgroundError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setEducationBackground(e.target.value);
              setEducationBackgroundError("");
            }}
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white p-2 rounded mr-2 w-2/5"
          >
            Back
          </button>
          <button
            onClick={nextClick}
            className="bg-green-500 text-white p-2 rounded w-2/5"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const EmploymentForm = ({ onNext, onBack, onInputChange, formData }) => {
    //   const handleInputChange = (e) => {
    //     onInputChange(e.target.id, e.target.value);

    //   };

    const [recentJobTitle, setRecentJobTitle] = useState("");
    const [jobType, setJobType] = useState("");
    const [employmentDuration, setEmploymentDuration] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [otherjobsDetail, setotherjobsDetail] = useState("");

    // error handle
    const [recentJobTitleError, setRecentJobTitleError] = useState("");
    const [jobTypeError, setJobTypeError] = useState("");
    const [employmentDurationError, setEmploymentDurationError] = useState("");
    const [companyNameError, setCompanyNameError] = useState("");
    const [otherjobsDetailError, setotherjobsDetailError] = useState("");

    // validation function
    const validate = () => {
      let isvalid = true;
      if (recentJobTitle.trim() === "") {
        setRecentJobTitleError("Recent Job Title is required");
        isvalid = false;
      }
      if (jobType.trim() === "") {
        setJobTypeError("Job Type is required");
        isvalid = false;
      }
      if (employmentDuration.trim() === "") {
        setEmploymentDurationError("Employment Duration is required");
        isvalid = false;
      }
      if (companyName.trim() === "") {
        setCompanyNameError("Company Name is required");
        isvalid = false;
      }
      if (otherjobsDetail.trim() === "") {
        setotherjobsDetailError("Other Job Details is required");
        isvalid = false;
      }
      return isvalid;
    };

    const nextClick = (e) => {
      e.preventDefault();
      const isValid = validate();
      if (!isValid) {
        return false;
      }

      handleInputChange("recentJobTitle", recentJobTitle);
      handleInputChange("jobType", jobType);
      handleInputChange("employmentDuration", employmentDuration);
      handleInputChange("companyName", companyName);
      handleInputChange("otherjobsDetail", otherjobsDetail);
      onNext();
    };

    return (
      <div>
        <ProgressBar step={3} />
        <h1 className="text-2xl font-bold mb-4 text-center">
          Employment History
        </h1>

        <div className="mb-4">
          <label
            htmlFor="recentJobTitle"
            className="block text-sm font-medium text-gray-600"
          >
            Recent Job Title
          </label>
          <select
            id="recentJobTitle"
            className={`mt-1 p-2 border rounded-md w-full ${
              recentJobTitleError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setRecentJobTitle(e.target.value);
              setRecentJobTitleError("");
            }}
          >
            <option value="" disabled selected>
              Select Recent Job Title
            </option>
            <option value="developer">Developer</option>
            <option value="manager">Manager</option>
            <option value="analyst">Analyst</option>
            <option value="designer">Designer</option>
            <option value="engineer">Engineer</option>
            <option value="consultant">Consultant</option>
            <option value="teacher">Teacher</option>
            <option value="nurse">Nurse</option>
            <option value="writer">Writer</option>
            <option value="artist">Artist</option>
            <option value="chef">Chef</option>
            <option value="scientist">Scientist</option>
            <option value="lawyer">Lawyer</option>
            <option value="doctor">Doctor</option>
            <option value="entrepreneur">Entrepreneur</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="jobType"
            className="block text-sm font-medium text-gray-600"
          >
            Job Type
          </label>
          <select
            id="jobType"
            className={`mt-1 p-2 border rounded-md w-full ${
              jobTypeError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setJobType(e.target.value);
              setJobTypeError("");
            }}
          >
            <option value="" disabled selected>
              Select Job Type
            </option>
            <option value="fullTime">Full Time</option>
            <option value="partTime">Part Time</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="employmentDuration"
            className="block text-sm font-medium text-gray-600"
          >
            Employment Duration
          </label>
          <select
            className={`mt-1 p-2 border rounded-md w-full ${
              employmentDurationError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setEmploymentDuration(e.target.value);
              setEmploymentDurationError("");
            }}
          >
            <option value="">Please Select the Experiance Year</option>
            <option value="1">Below 1</option>
            <option value="3">1-3 years</option>
            <option value="4">4 years +</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-600"
          >
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            id="companyName"
            placeholder="Enter the name of your company"
            className={`mt-1 p-2 border rounded-md w-full ${
              companyNameError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setCompanyNameError("");
            }}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="otherJobDetails"
            className="block text-sm font-medium text-gray-600"
          >
            Other Past Job Details
          </label>
          <textarea
            id="otherJobDetails"
            rows={3}
            value={otherjobsDetail}
            placeholder="Describe your other past job details..."
            className={`mt-1 p-2 border rounded-md w-full ${
              otherjobsDetailError ? "border-red-500" : ""
            }`}
            onChange={(e) => {
              setotherjobsDetail(e.target.value);
              setotherjobsDetailError("");
            }}
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white p-2 rounded mr-2 w-2/5"
          >
            Back
          </button>
          <button
            onClick={nextClick}
            className="bg-green-500 text-white p-2 rounded w-2/5"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const SummaryContent = ({ onBack, onInputChange, formData }) => {
    // Extract data from formData
    const {
      userId,
      dob,
      fatherName,
      motherName,
      grandfatherName,
      grandmotherName,
      // Add more fields from BasicInfoForm as needed
      educationLevel,
      courseType,
      courseName,
      schoolName,
      educationBackground,
      // Add more fields from EducationForm as needed
      recentJobTitle,
      jobType,
      employmentDuration,
      companyName,
      otherjobsDetail,
      // Add more fields from EmploymentForm as needed
    } = formData;

    const handleSubmit = (e) => {
      e.preventDefault();

      const data = {
        userId,
        dob,
        fatherName,
        motherName,
        grandfatherName,
        grandmotherName,
        educationLevel,
        courseType,
        courseName,
        schoolName,
        educationBackground,
        recentJobTitle,
        jobType,
        employmentDuration,
        companyName,
        otherjobsDetail,
      };

      console.log("Submitted data:", data);

      addUserdetailApi(data)
        .then((res) => {
          console.log("API response:", res.data);

          if (res.data.success === false) {
            toast.error("Something went wrong");
          } else {
            toast.success("Data inserted successfully");
            const user = JSON.parse(localStorage.getItem("user"));
            user.isVerified = true;
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/");
          }
        })
        .catch((error) => {
          console.error("API request failed:", error.message);
          toast.error("Failed to submit data");
        });
    };

    return (
      <div>
        <ProgressBar step={4} />
        <h1 className="text-2xl font-bold mb-4 text-center">Summary </h1>

        {/* Display basic information summary */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <p>Date of Birth: {dob}</p>
          <p>Father Name: {fatherName}</p>
          <p>Mother Name: {motherName}</p>
          <p>Grandfather Name: {grandfatherName}</p>
          <p>Grandmother Name: {grandmotherName}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          <p>Education Level: {educationLevel}</p>
          <p>School/University Name: {schoolName}</p>
          <p>Course Type: {courseType}</p>
          <p>Course Name: {courseName}</p>
          <p>Education Background: {educationBackground}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Employment</h2>
          <p>Recent Job Title: {recentJobTitle}</p>
          <p>Job Type: {jobType}</p>
          <p>Employment Duration: {employmentDuration}</p>
          <p>Company Name: {companyName}</p>
          <p>Other Job Details: {otherjobsDetail}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white p-2 rounded mr-2 w-2/5"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white p-2 rounded w-2/5"
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-96">
        <form>
          {activeTab === 1 && (
            <BasicInfoForm
              onNext={handleNext}
              onInputChange={handleInputChange}
              formData={formData}
            />
          )}

          {activeTab === 2 && (
            <EducationForm
              onNext={handleNext}
              onBack={handleBack}
              onInputChange={handleInputChange}
              formData={formData}
            />
          )}

          {activeTab === 3 && (
            <EmploymentForm
              onNext={handleNext}
              onBack={handleBack}
              onInputChange={handleInputChange}
              formData={formData}
            />
          )}
          {activeTab === 4 && (
            <SummaryContent
              onBack={handleBack}
              onInputChange={handleInputChange}
              formData={formData}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default VerificationScreen;
