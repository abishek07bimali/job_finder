import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";

const CVPage = () => {
    const [user, setUser] = useState({});
    const [educationHistory, setEducationHistory] = useState([]);
    const [employmentHistory, setEmploymentHistory] = useState([]);
  
  
    useEffect(() => {
      // Fetch user data from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
  
      // Fetch education history from localStorage
      const storedEducationHistory = JSON.parse(
        localStorage.getItem("educationHistory")
      );
      setEducationHistory(storedEducationHistory || []);
  
      // Fetch employment history from localStorage
      const storedEmploymentHistory = JSON.parse(
        localStorage.getItem("employmentHistory")
      );
      setEmploymentHistory(storedEmploymentHistory || []);
  
      // Check if the download flag is set, and trigger the download
      const downloadFlag = localStorage.getItem("downloadCV");
      if (downloadFlag) {
        localStorage.removeItem("downloadCV");
        downloadCV();
      }
    }, []);
  
    const downloadCV = () => {
      const content = document.getElementById("cv-content");
  
      const pdfOptions = {
        margin: 10,
        filename: "CV.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      html2pdf().from(content).set(pdfOptions).outputPdf();
    };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md">
        <div className="p-4" id="cv-content">
          <h2 className="text-lg font-semibold mb-2">CV for {user.firstName}</h2>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Education History</h3>
            {educationHistory.length > 0 ? (
              <ul>
                {educationHistory.map((education, index) => (
                  <li key={index} className="mb-2">
                    <p className="text-md font-semibold">
                      {education.degree} - {education.school}
                    </p>
                    <p className="text-sm text-gray-600">
                      {education.major}, {education.graduationYear}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No education history available</p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Employment History</h3>
            {employmentHistory.length > 0 ? (
              <ul>
                {employmentHistory.map((employment, index) => (
                  <li key={index} className="mb-2">
                    <p className="text-md font-semibold">
                      {employment.position} - {employment.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      {employment.startDate} to {employment.endDate}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No employment history available</p>
            )}
          </div>
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded w-full"
          onClick={downloadCV}
        >
          Download CV
        </button>
      </div>
    </div>
  );
};

export default CVPage;
