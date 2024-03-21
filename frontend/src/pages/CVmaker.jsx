// CVmaker.js
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const CVmaker = () => {

  const [backgroundColor, setBackgroundColor] = useState("#22c55e"); // Set a default color
  const [pageTextColor, setPageTextColor] = useState("#000000"); // Set a default text color

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    address: "",
    schoolName: "",
    subjectForStudy: "",
    startDate: "",
    passOutYear: "",
    educationBackground: "",
    recentJobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    githubUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    achievement1: "",
    achievement2: "",
    achievement3: "",
    achievement4: "",
    personalPortfolio: "",
    educationDetails: [],
    jobDetails: [],
    bio: "",
  });

  const handleInputChange = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addEducationDetail = () => {
    const newEducationDetail = {
      schoolName: data.schoolName,
      subjectForStudy: data.subjectForStudy,
      startDate: data.startDate,
      passOutYear: data.passOutYear,
      background: data.educationBackground,
    };

    // const addEducation=()=>{
    //   setData((prevData) => ({
    //     ...prevData,
    //     educationDetails: [...prevData.educationDetails, newEducationDetail],
    //     schoolName: "",
    //     subjectForStudy: "",
    //     passOutYear: "",
    //   }));
    // }

    setData((prevData) => ({
      ...prevData,
      educationDetails: [...prevData.educationDetails, newEducationDetail],
      schoolName: "",
      subjectForStudy: "",
      startDate: "",
      passOutYear: "",
      educationBackground: "",
    }));
  };

  const addJobDetail = () => {
    const newJobDetail = {
      recentJobTitle: data.recentJobTitle,
      companyName: data.companyName,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    setData((prevData) => ({
      ...prevData,
      jobDetails: [...prevData.jobDetails, newJobDetail],
      recentJobTitle: "",
      companyName: "",
      startDate: "",
      endDate: "",
    }));
  };

  const DownloadCv = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "mm",
    });
    const contentElement = document.getElementById("cvViewer");
    if (contentElement) {
      // Adjustments for styling and layout
      const marginTop = 10;
      const marginLeft = 10;
      const contentWidth = doc.internal.pageSize.width - 2 * marginLeft;
      const contentHeight = doc.internal.pageSize.height - 2 * marginTop;
      doc.setFontSize(16);
      doc.text("", marginLeft, marginTop);
      html2canvas(contentElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const scaleFactor = Math.min(
          contentWidth / canvas.width,
          contentHeight / canvas.height
        );
        const imgWidth = canvas.width * scaleFactor;
        const imgHeight = canvas.height * scaleFactor;

        doc.addImage(
          imgData,
          "PNG",
          marginLeft,
          marginTop + 10,
          imgWidth,
          imgHeight
        );

        // Save or download the PDF
        doc.save("my_cv.pdf");
      });
    }
  };

  const formatBulletPoints = (text) => {
    if (!text) {
      return null;
    }

    const lines = text.split("\n");
    return (
      <ul className="list-disc pl-4">
        {lines.map((line, index) => (
          <li key={index}>{line.trim()}</li>
        ))}
      </ul>
    );
  };
  useEffect(() => {
    document.body.style.color = pageTextColor;
  }, [pageTextColor]);
  

  return (
    <div className="p-4 flex items-start">
      <div className="w-2/6 bg-red-200 p-4 ">
        <h1 className="text-2xl font-bold mb-4">Personal Information</h1>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          {data.image && (
            <img
              src={data.image}
              alt="User"
              className="rounded-full h-16 w-16 object-cover mb-2 mx-auto"
            />
          )}
        </div>
        <div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2">
    Choose Background Color:
  </label>
  <input
    type="color"
    value={backgroundColor}
    onChange={(e) => setBackgroundColor(e.target.value)}
    className="mb-2"
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2">
    Choose Page Text Color:
  </label>
  <input
    type="color"
    value={pageTextColor}
    onChange={(e) => setPageTextColor(e.target.value)}
    className="mb-2"
  />
</div>
        <div className="mb-4 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            />
        </div>
        <div className="flex">
          <div className="mb-4 w-2/4 ml-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div className="mb-4 w-2/4 ml-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
        </div>
        <div className="flex">
          <div className="mb-4 w-2/4 ml-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date of Birth:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              value={data.dateOfBirth}
              max={new Date().toISOString().split('T')[0]} 
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            />
          </div>
          <div className="mb-4 ml-1 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>
        </div>
        <div className="flex">
          <div className="mb-4 w-2/4 ml-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Father's Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.fatherName}
              onChange={(e) => handleInputChange("fatherName", e.target.value)}
            />
          </div>
          <div className="mb-4 w-2/4 ml-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mother's Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.motherName}
              onChange={(e) => handleInputChange("motherName", e.target.value)}
            />
          </div>
        </div>

        {/* Add other personal information fields */}

        <h1 className="text-2xl font-bold mb-4 mt-8">Social Media User Name</h1>
        <div className="flex">
          <div className="mb-4 ml-1 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Github username:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.githubUrl}
              onChange={(e) => handleInputChange("githubUrl", e.target.value)}
            />
          </div>
          <div className="mb-4 ml-1 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Linkedin username:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.linkedinUrl}
              onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
            />
          </div>
        </div>

        <div className="flex">
          <div className="mb-4 ml-1 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Persoanl Portfolio:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.personalPortfolio}
              onChange={(e) =>
                handleInputChange("personalPortfolio", e.target.value)
              }
            />
          </div>
          <div className="mb-4 ml-1 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Youtube Channel:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.youtubeUrl}
              onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Instagram username:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={data.instagramUrl}
            onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 mt-8">Achievement</h1>

        <div className="mb-4 ml-1 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Achievement 1:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={data.achievement1}
            onChange={(e) => handleInputChange("achievement1", e.target.value)}
          />
        </div>
        <div className="mb-4 ml-1 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Achievement 2:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={data.achievement2}
            onChange={(e) => handleInputChange("achievement2", e.target.value)}
          />
        </div>
        <div className="mb-4 ml-1 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Achievement 3:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={data.achievement3}
            onChange={(e) => handleInputChange("achievement3", e.target.value)}
          />
        </div>
        <div className="mb-4 ml-1 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Achievement 4:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={data.achievement4}
            onChange={(e) => handleInputChange("achievement4", e.target.value)}
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 mt-8">Bio</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bio:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={data.bio}
            rows={5}
            onChange={(e) => handleInputChange("bio", e.target.value)}
          ></textarea>
        </div>

        <h1 className="text-2xl font-bold mb-4 mt-8">Education</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            School Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={data.schoolName}
            onChange={(e) => handleInputChange("schoolName", e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Subject for Study:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={data.subjectForStudy}
            onChange={(e) =>
              handleInputChange("subjectForStudy", e.target.value)
            }
          />
        </div>
        <div className="flex">
          <div className="mb-4 ml-2 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Started Year:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              max={new Date().toISOString().split('T')[0]} 
              value={data.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
          </div>

          <div className="mb-4 ml-2 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Pass-out Year:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              max={new Date().toISOString().split('T')[0]} 
              value={data.passOutYear}
              onChange={(e) => handleInputChange("passOutYear", e.target.value)}
              />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Education Background:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={data.educationBackground}
            rows={3}
            onChange={(e) =>
              handleInputChange("educationBackground", e.target.value)
            }
          ></textarea>
          <button
            onClick={addEducationDetail}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Add Education Detail
          </button>
        </div>

        {/* Add other education fields */}

        <h1 className="text-2xl font-bold mb-4 mt-8">Jobs Information</h1>

        <div className="flex">
          <div className="mb-4 w-2/4 ml-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Job Title:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.recentJobTitle}
              onChange={(e) =>
                handleInputChange("recentJobTitle", e.target.value)
              }
            />
          </div>
          <div className="mb-4 w-2/4 ml-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Company Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
            />
          </div>
        </div>
        <div className="flex">
          <div className="mb-4 ml-1 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date :
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              max={new Date().toISOString().split('T')[0]} 
              value={data.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
          </div>
          <div className="mb-4 ml-1 w-2/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Year:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              max={new Date().toISOString().split('T')[0]} 
              value={data.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={addJobDetail}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Add Job Detail
          </button>
        </div>

        {/* Add other jobs fields */}

        <button
          onClick={DownloadCv}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-8"
        >
          Download Cv
        </button>
      </div>

      <div className=" w-3/4 h-[100vh] bg-green-200 p-4 sticky top-0 z-20">
        <div className="text-center mb-4 flex" id="cvViewer">
          <div className="w-2/5 text-left p-3 h-[96vh]  rounded-xl" style={{ backgroundColor: backgroundColor }}>
            <h1 className="text-xl text-center font-bold mb-4">
              Personal Information
            </h1>
            {/* {data.image && ( */}
            <div className="mb-2">
              {data.image ? (
                <img
                  src={data.image}
                  alt="User"
                  className="rounded-full h-20 w-20 object-cover  border-2 border-green-500  mx-auto mb-2"
                />
              ) : (
                <div className="rounded-full h-20 w-20 flex items-center justify-center bg-white border-2 border-green-500 mx-auto mb-2">
                  <i className="fas fa-user text-green-500 text-2xl"></i>
                </div>
              )}
            </div>
            {/* )} */}
            {/* {data.name && ( */}
            <p className="mb-2">
              <strong>Name:</strong> {data.name}
            </p>
            {/* )} */}
            {/* {data.email && ( */}
            <p className="mb-2">
              <strong>Email:</strong> {data.email}
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> {data.phone}
            </p>
            {/* )} */}
            {/* {data.fatherName && ( */}
            <p className="mb-2">
              <strong>Father's Name:</strong> {data.fatherName}
            </p>
            {/* )} */}
            {/* {data.motherName && ( */}
            <p className="mb-2">
              <strong>Mother's Name:</strong> {data.motherName}
            </p>
            {/* )} */}
            {/* {data.dateOfBirth && ( */}
            <p className="mb-2">
              <strong>Date of Birth:</strong> {data.dateOfBirth}
            </p>
            {/* )} */}
            {/* {data.address && ( */}
            <p className="mb-2">
              <strong>Address:</strong> {data.address}
            </p>
            {/* )} */}
            <h2 className="text-xl text-center font-bold mb-2 mt-4">
              Social Media
            </h2>
            <div className="mb-2">
              {data.githubUrl && (
                <p className="text-sm text-black">
                  <i className="fab fa-github mr-2"></i>
                  <strong>Github:</strong> {data.githubUrl}
                </p>
              )}
            </div>
            <div className="mb-2">
              {data.linkedinUrl && (
                <p className="text-sm text-black">
                  <i className="fab fa-linkedin mr-2"></i>
                  <strong>LinkedIn:</strong> {data.linkedinUrl}
                </p>
              )}
            </div>
            <div className="mb-2">
              {data.personalPortfolio && (
                <p className="text-sm text-black">
                  <i className="fas fa-link mr-2"></i>
                  <strong> Portfolio:</strong> {data.personalPortfolio}
                </p>
              )}
            </div>
            <div className="mb-2">
              {data.youtubeUrl && (
                <p className="text-sm text-black">
                  <i class="fa-brands fa-youtube"></i>{" "}
                  <strong> Youtube:</strong> {data.youtubeUrl}
                </p>
              )}
            </div>
            <div className="mb-2">
              {data.instagramUrl && (
                <p className="text-sm text-black">
                  <i class="fa-brands fa-square-instagram"></i>{" "}
                  <strong> Instagram:</strong> {data.instagramUrl}
                </p>
              )}
            </div>
            
            <h2 className="text-xl text-center font-bold mb-2 mt-4">
              Achievement{" "}
            </h2>
            <div className="mb-2">
              {data.achievement1 && (
                <p className="text-sm text-black">
                  <i class="fa-solid fa-star"></i> <strong> 1: </strong>{" "}
                  {data.achievement1}
                </p>
              )}
            </div>{" "}
            <div className="mb-2">
              {data.achievement2 && (
                <p className="text-sm text-black">
                  <i class="fa-solid fa-star"></i> <strong> 2: </strong>{" "}
                  {data.achievement2}
                </p>
              )}
            </div>{" "}
            <div className="mb-2">
              {data.achievement3 && (
                <p className="text-sm text-black">
                  <i class="fa-solid fa-star"></i> <strong> 3: </strong>{" "}
                  {data.achievement3}
                </p>
              )}
            </div>{" "}
            <div className="mb-2">
              {data.achievement4 && (
                <p className="text-sm text-black">
                  <i class="fa-solid fa-star"></i> <strong> 4: </strong>{" "}
                  {data.achievement4}
                </p>
              )}
            </div>
          </div>
          <div className="ml-3 text-left w-3/5">
            <h2 className="text-xl font-bold mb-2 mt-4">Bio</h2>
            {data.bio}

            <h2 className="text-xl font-bold mb-2 mt-4">Education</h2>
            {data.educationDetails.map((detail, index) => (
              <div key={index} className="mb-2">
                {/* Display education details in the CV viewer */}
                <strong>{detail.schoolName}</strong>({detail.startDate})-(
                {detail.passOutYear})
                <br />
                {detail.subjectForStudy}
                <br />
                {formatBulletPoints(detail.background)}
              </div>
            ))}
            <h2 className="text-xl font-bold mb-2 mt-4">Jobs Information</h2>
            {data.jobDetails.map((detail, index) => (
              <div key={index} className="mb-2">
                {detail.recentJobTitle && (
                  <p className="text-sm text-gray-600">
                    <strong>Job Title:</strong> {detail.recentJobTitle} (
                    {detail.startDate} - {detail.endDate})
                  </p>
                )}
                {detail.companyName && (
                  <p className="text-sm text-gray-600">
                    <strong>Company Name:</strong> {detail.companyName}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVmaker;
