import AdminLayout from "../../components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getJobsbyId, updateJobsApi } from "../../api/api";
import { toast } from "react-toastify";

const EditJobs = () => {

  
  const [data, setdata] = useState({});

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobResponsibility, setJobResponsibility] = useState("");
  const [salary, setSalary] = useState("");
  const [contact, setContactInformation] = useState("");
  const [remoteWorkOptions, setRemoteWorkOptions] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [jobTags, setJobTags] = useState([]);
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  // const [tagInput, setTagInput] = useState("");
  const [oldImage,setOldImage]=useState('');

  const [tagInput, setTagInput] = useState("");

  const [previewImage, setPreviewImage] = useState(null);
  const [jobsImage, setJobsImage] = useState(null); 

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setJobTags([...jobTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = [...jobTags];
    newTags.splice(index, 1);
    setJobTags(newTags);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    setJobsImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const { id } = useParams();
  const navigate = useNavigate();

useEffect(() => {
    getJobsbyId(id)
      .then((res) => {
        setJobTitle(res.data.jobs.jobTitle);
        setCompanyName(res.data.jobs.companyName);
        setLocation(res.data.jobs.location);
        setJobType(res.data.jobs.jobType);
        setExperienceLevel(res.data.jobs.experianceLevel);
        setEducationLevel(res.data.jobs.educationLevel);
        setJobDescription(res.data.jobs.jobDescription);
        setJobResponsibility(res.data.jobs.jobResponsibilities);
        setSalary(res.data.jobs.salary);
        setContactInformation(res.data.jobs.contact);
        setRemoteWorkOptions(res.data.jobs.workType);
        setCompanyOverview(res.data.jobs.companyOverview);
        setCategory(res.data.jobs.category);
        setSelectedDate(res.data.jobs.applyBefore);
        setJobTags(res.data.jobs.jobTags);
        setOldImage(res.data.jobs.image);   
         })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();

    const contactPattern = /^\d{10}$/;
    if (!contactPattern.test(contact)) {
      return toast.error("Contact number should have 10 valid numbers.");
    }

    const formData = new FormData();
    formData.append("jobTitle", jobTitle);
    formData.append("companyName", companyName);
    formData.append("location", location);
    formData.append("jobType", jobType);
    formData.append("experianceLevel", experienceLevel);
    formData.append("educationLevel", educationLevel);
    formData.append("jobDescription", jobDescription);
    formData.append("jobResponsibility", jobResponsibility);
    formData.append("salary", salary);
    formData.append("contact", contact);
    formData.append("workType", remoteWorkOptions);
    formData.append("companyOverview", companyOverview);
    formData.append("jobTags", JSON.stringify(jobTags));
    formData.append("image", jobsImage);
    formData.append("category", category);
    formData.append("selectedDate", selectedDate);

    updateJobsApi(id, formData)
      .then((res) => {
        if (res.data.success == false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          navigate("/admin/addjobs");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Server error");
      });
  };

  return (
    <AdminLayout >
      <div className="max-w-7xl mx-auto grid grid-row-1 sm:grid-cols-2 gap-6 bg-white p-20">
        <h4 className="text-2xl font-bold text-green-500 sm:text-center p-5 col-span-2 ">
          Update Jobs
        </h4>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            placeholder="Enter Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            placeholder="Enter Company Name"
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={location}
            placeholder="Enter Location"
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="jobType"
            className="block text-sm font-medium text-gray-700"
          >
            Job Type
          </label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="" className="!text-gray-200 checked:!bg-gray-900">
              Please Select the Work type
            </option>
            <option value="fullTime">Full Time</option>
            <option value="partTime">Part Time</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="experienceLevel"
            className="block text-sm font-medium text-gray-700"
          >
            Experience Level
          </label>
          <select
            onChange={(e) => setExperienceLevel(e.target.value)}
            value={experienceLevel}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Please Select the Work type</option>
            <option value="entryLevel">Entry Level</option>
            <option value="midLevel">Mid Level</option>
            <option value="seniorLevel">Senior Level</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Education Level
          </label>
          {/* <input
          type="text"
          placeholder="Enter Education Level"
          className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        /> */}

          <select
            onChange={(e) => setEducationLevel(e.target.value)}
            value={educationLevel}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Please Select the Work type</option>
            <option value="10 +2 ">10 +2 pass</option>
            <option value="bachelor">Bachelor Level</option>
            <option value="master">Master Level</option>
            <option value="any level">Any Level</option>
          </select>
        </div>
        <div className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            placeholder="Enter Job Description"
            rows="5"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Job Responsibility
          </label>
          <input
            placeholder="Enter Job Responsibility"
            rows="5"
            value={jobResponsibility}
            onChange={(e) => setJobResponsibility(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Salary/Compensation:
          </label>
          <input
            type="number"
            value={salary}
            placeholder="Enter Salary/Compensation:"
            onChange={(e) => setSalary(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Job Category:
          </label>
          <select
                      value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="" disabled selected>
              Select Job Category
            </option>
            <option value="software">Software</option>
            <option value="management">Management</option>
            <option value="engineering">Engineering</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
            <option value="design">Design</option>
            <option value="sales">Sales</option>
            <option value="customer service">Customer Service</option>
            <option value="human resources">Human Resources</option>
            <option value="consulting">Consulting</option>
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
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="contactInformation"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Information
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">+977</span>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContactInformation(e.target.value)}
              placeholder="Enter Contact Information"
              className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="remoteWorkOptions"
            className="block text-sm font-medium text-gray-700"
          >
            Remote Work Options
          </label>
          <select
            // id="remoteWorkOptions"
            // name="remoteWorkOptions"
            value={remoteWorkOptions}
            onChange={(e) => setRemoteWorkOptions(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Please Select the Work Option</option>
            <option value="remote">Yes</option>
            <option value="office">No</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="selectDate"
            className="block text-sm font-medium text-gray-700"
          >
            Apply Before{" "}
          </label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Company Overview
          </label>
          <textarea
            rows="2"
            type="text"
            value={companyOverview}
            onChange={(e) => setCompanyOverview(e.target.value)}
            placeholder="Enter Company Overview"
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4 ">
          <label
            htmlFor="jobImage"
            className="block text-sm font-medium text-gray-700"
          >
            Job Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={uploadImage}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Job Tags
          </label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter Job Tags"
              value={tagInput}
              onChange={handleTagInput}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mt-2 flex flex-wrap">
            {jobTags.map((tag, index) => (
              <div
                key={index}
                className="bg-green-400 text-blue-800 px-2 py-1 rounded-full m-1 flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-red-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          </div>
          <div>
          <h6>Old Image</h6>

          <img src={oldImage} className="object-fit-cover rounded-3" height={200} width={200} alt=" " />

          </div>
          
        {previewImage && (
          <div className="mb-4 right-10">
            <label className="block text-sm font-medium text-gray-700">
              Selected Image
            </label>
            <img
              src={previewImage}
              alt="Selected Job Image"
              className="mt-2 max-w-full h-auto"
              height={200}
              width={200}
            />
          </div>
        )}
        

        <button
          type="button"
          className="bg-green-500 text-white py-2 px-4 rounded mt-3 col-span-2"
          onClick={handleEdit}
        >
          Update Job
        </button>
      </div>
    </AdminLayout>
  );
};

export default EditJobs;
