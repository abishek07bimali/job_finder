import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../style/adminNav.css";
import {
  addJobApi,
  deleteJobsApi,
  getAllJobsAdminApi,
  getJobsByuserIdApi,
  getJobsbyId,
} from "../../api/api";
import { toast } from "react-toastify";
import Modal from "react-modal";
import AdminLayout from "../../components/AdminLayout";
import ReactDatePicker from "react-datepicker";

const AddJobs = () => {
  // get user id form local storage
  const user = JSON.parse(localStorage.getItem("user"));

  const [showTable, setShowTable] = useState(true);

  const [jobsList, setJobsList] = useState([]);
  const [sortOrder, setSortOrder] = useState({ column: null, asc: true });

  // Fetch all jobs from the API
  // =============================important part as this part makes the API Request and fetches the data from the backend ===============
  //
  useEffect(() => {
    if (user && user.isSuperAdmin) {
      getAllJobsAdminApi()
        .then((res) => {
          if (res.data && res.data.jobs) {
            // Add dynamic IDs to each job
            const jobsWithDynamicIds = res.data.jobs.map((job, index) => ({
              ...job,
              dynamicId: index + 1,
            }));
            setJobsList(jobsWithDynamicIds);
          } else {
            console.error("Invalid API response:", res);
          }
        })
        .catch((err) => {
          console.error("API request failed:", err);
        });
    } else {
      getJobsByuserIdApi(user._id)
        .then((res) => {
          if (res.data && res.data.jobs) {
            // Add dynamic IDs to each job
            const jobsWithDynamicIds = res.data.jobs.map((job, index) => ({
              ...job,
              dynamicId: index + 1,
            }));
            setJobsList(jobsWithDynamicIds);
          } else {
            console.error("Invalid API response:", res);
          }
        })
        .catch((err) => {
          console.error("API request failed:", err);
        });
    }
  }, []);

  //
  // ========= end of calling the Api ===========

  const getColumnName = (columnIndex) => {
    const columnNames = ["id", "image", "title", "company", "phone", "work","status"];
    return columnNames[columnIndex];
  };

  const sortTable = (columnIndex) => {
    const columnName = getColumnName(columnIndex);
    const isAscending = sortOrder.column === columnName ? !sortOrder.asc : true;

    const sortedData = [...jobsList].sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      if (valueA === undefined || valueB === undefined) {
        return isAscending ? -1 : 1;
      }

      const compareValueA =
        typeof valueA === "number" ? valueA : valueA.toString().toLowerCase();
      const compareValueB =
        typeof valueB === "number" ? valueB : valueB.toString().toLowerCase();

      if (isAscending) {
        return compareValueA < compareValueB ? -1 : 1;
      } else {
        return compareValueA > compareValueB ? -1 : 1;
      }
    });

    setJobsList(sortedData);
    setSortOrder({ column: columnName, asc: isAscending });
  };

  // code for pagination
  // important part of the pagination

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobsList.slice(indexOfFirstItem, indexOfLastItem);
  const pageNumbers = Math.ceil(jobsList.length / itemsPerPage);

  const renderPaginationControls = () => {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < pageNumbers;

    return (
      <div className="flex items-center mt-4">
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          className={`mr-2 px-3 py-1 rounded ${
            canGoPrevious
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          disabled={!canGoPrevious}
        >
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        {Array.from({ length: pageNumbers }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mr-2 px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, pageNumbers))
          }
          className={`ml-2 px-3 py-1 rounded ${
            canGoNext ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          disabled={!canGoNext}
        >
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <span className="ml-4">
          Page {currentPage} of {pageNumbers}
        </span>
      </div>
    );
  };

  //
  // end of the pagination code
  // =====================================================================================================================
// Function to calculate days until the applyBefore date
const calculateDaysUntilExpiration = (applyBeforeDate) => {
  const today = new Date();
  const applyBefore = new Date(applyBeforeDate);
  const differenceInTime = applyBefore.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  if (differenceInDays < 0) {
    return 'Expired';
  } else {
    return differenceInDays + ' days remaining';
  }
};


  // code to display the table in same screens
  const renderTable = () => {
    if (!jobsList || jobsList.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <span className="text-2xl">No jobs found</span>
        </div>
      );
    }

    return (
      <div>
        <table className="min-w-full bg-white border border-gray-300 rounded-2">
          <thead>
            <tr>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(0)}
              >
                ID {sortOrder.column === "id" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer">Image</th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(1)}
              >
                Title{" "}
                {sortOrder.column === "title" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer">
                Company{" "}
                {sortOrder.column === "company" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(3)}
              >
                Phone{" "}
                {sortOrder.column === "phone" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(4)}
              >
                Work{" "}
                {sortOrder.column === "work" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(4)}
              >
                Status{" "}
                {sortOrder.column === "status" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              {/* {user && user.isSuperAdmin ? null : ( */}
              <th className="py-2 px-4 border-b cursor-pointer">Action</th>
              {/* )} */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row) => (
              <tr key={row._id}>
                <td className="py-2 px-4 border-b text-center">
                  {row.dynamicId}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <img src={row.image} width={30} alt="" />
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {row.jobTitle}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {row.companyName}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {row.contact}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {row.workType}
                </td>
                <td className="py-2 px-4 border-b text-center">
                {calculateDaysUntilExpiration(row.applyBefore)}
                </td>
                {/* {user && user.isSuperAdmin ? null : ( */}
                <td className="py-2 px-4 border-b text-center">
                  <Link
                    to={`/admin/edit/${row._id}`}
                    className="bg-blue-500 m-1 text-white py-2 px-4 rounded mr-2"
                    style={{ backgroundColor: "#123697" }}
                  >
                    <i class="fa-regular fa-pen-to-square text-[12px]"></i>
                  </Link>
                  <button
                    onClick={(e) => alertDescription(row._id)}
                    className="bg-green-700 m-1 text-white py-2 px-4 rounded mr-2"
                  >
                    <i class="fa-regular fa-eye text-[12px]"></i>
                  </button>
                  <button
                    onClick={(e) => handleDelete(row._id)}
                    className="m-1 text-white py-2 px-4 rounded mr-2"
                    style={{ backgroundColor: "#e92939" }}
                  >
                    <i class="fa-regular fa-trash-can text-[12px]"></i>
                  </button>
                </td>
                {/* )} */}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center">
          {renderPaginationControls()}
        </div>
      </div>
    );
  };
  //
  //  end of the code to render the table in the same screen
  // =====================================================================================================================

  //  code to add jobstabg in the use state
  const [tagInput, setTagInput] = useState("");
  const [jobTags, setJobTags] = useState([]);
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

  // set loading option
  const [loading, setLoading] = useState(false);

  //  code to add jobs to the backend
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
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleAddJobs = (e) => {
    e.preventDefault();
    // console.log(jobTitle, companyName, location, jobType, experienceLevel, educationLevel, jobDescription, jobResponsibility, salary, contactInformation, remoteWorkOptions, companyOverview, jobTags);
    const contactPattern = /^\d{10}$/;

    if (!contactPattern.test(contact)) {
      return toast.error("Contact number should have 10 valid numbers.");
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("userId", user._id);
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
    formData.append("jobsImage", jobsImage);
    formData.append("category", category);
    formData.append("selectedDate", selectedDate);

    addJobApi(formData)
      .then((res) => {
        if (res.data.success == false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setLoading(false);
          window.location.reload();
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  const handleDelete = (id) => {
    // console.log(id);
    const confirm = window.confirm(
      "Are you sure you want to delete this jobs?"
    );
    if (confirm) {
      deleteJobsApi(id)
        .then((res) => {
          if (res.data.success == false) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Server error");
        });
    } else {
      return;
    }
  };

  // modal pop off code
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [jobDetails, setJobDetails] = useState(null);

  const alertDescription = (id) => {
    getJobsbyId(id)
      .then((res) => {
        console.log(res.data.jobs);
        setJobDetails(res.data.jobs);
        openModal(); // Open the modal
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // job adding form
  //  important part of the code as this part is responsible for the form to add the jobs
  //
  const renderForm = () => {
    return (
      <div className="max-w-7xl mx-auto grid grid-row-1 sm:grid-cols-2 gap-6  p-4">
        <h4 className="text-2xl font-bold text-green-500 sm:text-center p-5 col-span-2 ">
          Add Jobs
        </h4>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            placeholder="Enter Job Title"
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
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Please Select the Experience Level</option>
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
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Please Select the Education Level</option>
            <option value="bachelor">Bachelor Level</option>
            <option value="master">Master Level</option>
            <option value="highSchool">High School</option>
          </select>
        </div>
        <div className="mb-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            placeholder="Enter Job Description"
            rows="5"
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
            // value={selectedDate}
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
          onClick={handleAddJobs}
        >
         
          {loading ? "Saving ...." : "  Add Jobs"}

        </button>
      </div>
    );
  };

  //
  //  end of the form code for form to add jobs
  // ==================================================================================================

  return (
    <>
      <AdminLayout>
        <div className="main-content flex-1 bg-white mt-10 md:mt-2 pb-24 md:pb-5 ">
          <div className="bg-gray-800 pt-30">
            <div class="rounded-tl-3xl bg-gradient-to-r from-green-900 to-blue-800 p-4 shadow text-2xl text-white ">
              <h3 className="font-bold pl-2">Jobs</h3>
            </div>
          </div>

          {showTable ? (
            <>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded absolute mt-5 right-10 z-10"
                onClick={() => setShowTable(false)}
              >
                Add Jobs
              </button>
              <div className="container mx-auto p-4 mt-20">
                <div className="overflow-x-auto">{renderTable()}</div>
              </div>
            </>
          ) : (
            <>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded absolute mt-5 right-10 z-10"
                onClick={() => setShowTable(true)}
              >
                <i class="fa-regular fa-circle-xmark"></i>
              </button>

              <div className="container mx-auto p-4 mt-20">{renderForm()}</div>
            </>
          )}
        </div>
      </AdminLayout>
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

            {/* Display job details */}
            {jobDetails && (
              <div className="text-center justify-center mt-5">
                <p className="text-lg mb-4">{jobDetails.jobTitle}</p>
                <img
                  src={jobDetails.image}
                  alt=""
                  className="items-center"
                  width={100}
                />
                <p>Title: {jobDetails.jobTitle}</p>
                <p>Company: {jobDetails.jobTitle}</p>
                <p>Contact: {jobDetails.contact}</p>
                <p>Work Type: {jobDetails.workType}</p>
                <button
                  onClick={closeModal}
                  className="bg-green-500 w-1/5 text-white font-bold py-2 px-4 rounded"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddJobs;
