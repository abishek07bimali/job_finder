import React, { useEffect, useState } from "react";
import {
  getAllApplicationListApi,
  getAllJobsApi,
  getApplicationByAdminApi,
  rejectApplicationStatusApi,
  updateApplicationStatusApi,
} from "../../api/api";
import AdminLayout from "../../components/AdminLayout";
import { set } from "date-fns";

const ApplicationList = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [sortOrder, setSortOrder] = useState({ column: null, asc: true });
  const [applicationList, setApplicationList] = useState([]);

  useEffect(() => {
    if (user.isSuperAdmin) {
      getAllApplicationListApi()
        .then((res) => {
          if (res.data && res.data.application) {
            // Add dynamic IDs to each application
            const applicationWithDynamicIds = res.data.application.map(
              (application, index) => ({
                ...application,
                dynamicId: index + 1,
              })
            );
            setApplicationList(applicationWithDynamicIds);
            console.log("API response:", applicationWithDynamicIds);
          } else {
            console.error("Invalid API response:", res);
          }
        })
        .catch((err) => {
          console.error("API request failed:", err);
        });
    } else {
      getApplicationByAdminApi(user._id)
        .then((res) => {
          if (res.data && res.data.application) {
            // Add dynamic IDs to each application
            const applicationWithDynamicIds = res.data.application.map(
              (application, index) => ({
                ...application,
                dynamicId: index + 1,
              })
            );
            setApplicationList(applicationWithDynamicIds);
            console.log("API response:", applicationWithDynamicIds);
          } else {
            console.error("Invalid API response:", res);
          }
        })
        .catch((err) => {
          console.error("API request failed:", err);
        });
    }
  }, []);

  const getColumnName = (columnIndex) => {
    const columnNames = ["id", "employee", "job", "company", "contact", "work"];
    return columnNames[columnIndex];
  };

  const sortTable = (columnIndex) => {
    const columnName = getColumnName(columnIndex);
    const isAscending = sortOrder.column === columnName ? !sortOrder.asc : true;

    const sortedData = [...applicationList].sort((a, b) => {
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

    setApplicationList(sortedData);
    setSortOrder({ column: columnName, asc: isAscending });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applicationList.slice(indexOfFirstItem, indexOfLastItem);
  const pageNumbers = Math.ceil(applicationList.length / itemsPerPage);

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
        <span className="ml-4 text-white">
          Page {currentPage} of {pageNumbers}
        </span>
      </div>
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const openModal = (id) => {
    setSelectedApplicationId(id);
    setIsModalOpen(true);
  };
  const closeButton = () => {
    setIsModalOpen(false);
  };

  const closeModal = () => {
    const data = {
      applicationid: selectedApplicationId,
      isVerified: true,
      interview: selectedDate,
    };

    console.log(data);

    if (selectedDate) {
      if (selectedApplicationId) {
        updateApplicationStatusApi(selectedApplicationId, data);
        window.location.reload();
      }
    }

    setSelectedDate(null);
    setSelectedApplicationId(null);
    setIsModalOpen(false);
  };

  const rejectButton = () => {
    const data = {
      applicationid: selectedApplicationId,
      isRejected: true,
    };

    if (selectedApplicationId) {
      rejectApplicationStatusApi(selectedApplicationId, data);
      window.location.reload();
    }

    setSelectedApplicationId(null);
    setIsModalOpen(false);
  };

  const alertDescription = (id) => {
    const job = applicationList.find((jobs) => jobs._id === id);
    setJobDetails(job);
    openModal(id);
  };
  // const renderTooltip = (text) => {
  //   return (
  //     <div className="tooltip">
  //       <span>{text}</span>
  //     </div>
  //   );
  // };

  return (
    <>
      <AdminLayout>
        <div className="bg-gray-800 ">
          <div class="rounded-tl-3xl bg-gradient-to-r from-green-900 to-blue-800 p-4 shadow text-2xl text-white ">
            <h3 className="font-bold pl-2">Application List</h3>
          </div>
        </div>
        <div className="container mx-auto p-4 mt-2">
          <table className="min-w-full bg-white border border-gray-300 rounded-2">
            <thead>
              <tr>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(0)}
                >
                  ID {sortOrder.column === "id" && (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(1)}
                >
                  Employee{" "}
                  {sortOrder.column === "employee" &&
                    (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(2)}
                >
                  Job{" "}
                  {sortOrder.column === "job" && (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(3)}
                >
                  Company{" "}
                  {sortOrder.column === "company" &&
                    (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(4)}
                >
                  User Contact{" "}
                  {sortOrder.column === "contact" &&
                    (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(5)}
                >
                  Work Type{" "}
                  {sortOrder.column === "work" && (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row) => (
                <tr key={row._id}>
                  <td className="py-2 px-4 border-b text-center">
                    {row.dynamicId}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.userId.firstName} {row.userId.lastName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.jobsId?.jobTitle}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.jobsId?.companyName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.userId.phone}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.jobsId?.jobType}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => alertDescription(row._id)}
                      title="View Details"
                      className="bg-green-700 m-1 text-white py-2 px-4 rounded mr-2"
                    >
                      <i class="fa-regular fa-eye text-[12px]"></i>
                    </button>
                    {row.isVerified ? (
                      <button
                        className=" bg-green-500 m-1 text-white py-2 px-4 rounded mr-2"
                        title="verified"
                      >
                        <i class="fa-solid fa-check text-[12px]"></i>
                      </button>
                    ) : row.isRejected ? (
                      <>
                        <button
                          className="m-1 text-white py-2 px-4 rounded mr-2"
                          title="Rejected"
                          style={{ backgroundColor: "#e92939" }}
                        >
                          <i class="fa-solid fa-xmark text-[12px]"></i>
                        </button>
                      </>
                    ) : (
                      <button
                        className="m-1 text-white py-2 px-4 rounded mr-2 bg-yellow-500"
                        title="Pending"
                      >
                        <i class="fa-solid fa-xmark text-[12px]"></i>
                      </button>
                    )}
                    {row.isRejected ? (
                      <button
                        className=" bg-green-500 m-1 text-white py-2 px-4 rounded mr-2"
                        style={{ backgroundColor: "#e92939" }}
                        title="Rejected"
                      >
                        <i class="fa-solid fa-xmark text-[12px]"></i>
                      </button>
                    ) : (
                      <button
                        className="m-1 bg-green-500 text-white py-2 px-4 rounded mr-2"
                        title="Not Rejected"
                      >
                        <i class="fa-solid fa-check text-[12px]"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center">
            {renderPaginationControls()}
          </div>
        </div>
      </AdminLayout>
      {isModalOpen && (
        <div
          className="fixed inset-0 grid place-items-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative mx-auto p-5 border max-w-2xl w-4/5 shadow-lg rounded-md bg-white">
            {/* Close button */}
            <div className="absolute top-2 right-2">
              <button
                onClick={closeButton}
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                <i className="fa-solid fa-xmark p-2"></i>
              </button>
            </div>

            {jobDetails && (
              <div className="text-center mt-5">
                <div className="flex justify-center items-center mb-5">
                  {/* User Details (Left Side) */}
                  <div className="mr-5 text-left">
                    <p className="text-lg mb-2">User Details</p>
                    <img
                      src={jobDetails.userId.image}
                      alt=""
                      width={50}
                      height={30}
                      className="rounded-full  mb-2 mx-auto"
                    />
                    <p>
                      Name: {jobDetails.userId.firstName}{" "}
                      {jobDetails.userId.lastName}
                    </p>
                    <p>Email: {jobDetails.userId.email}</p>
                    <p>Phone: {jobDetails.userId.phone}</p>
                    <p>Address: {jobDetails.userId.address}</p>
                    {jobDetails.userId.cvFile && (
                      <div>
                        <a
                          href={jobDetails.userId.cvFile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="mr-5 ">View CV:</span>

                          <i className="fa-solid fa-file-pdf text-red-500 cursor-pointer"></i>
                        </a>
                      </div>
                    )}{" "}
                  </div>

                  {/* Job Details (Right Side) */}
                  <div className="text-left">
                    <p className="text-lg mb-2">Job Details</p>
                    <img
                      src={jobDetails.jobsId.image}
                      alt=""
                      width={50}
                      height={30}
                      className="rounded-full  mb-2 mx-auto"
                    />
                    <p>Title: {jobDetails.jobsId.jobTitle}</p>
                    <p>Company: {jobDetails.jobsId.jobTitle}</p>
                    <p>Contact: {jobDetails.jobsId.contact}</p>
                    <p>Work Type: {jobDetails.jobsId.workType}</p>
                    {/* Add other job details as needed */}
                  </div>
                </div>
                {jobDetails.isVerified || jobDetails.isRejected ? null : (
                  <div className="text-center">
                    <label className="text-lg mb-2 block">
                      Interview Date:
                    </label>
                    <input
                      type="date"
                      // value={selectedDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]} 
                      required
                      className="border py-2 px-3 rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                )}
                {user.isSuperAdmin ? null : (
                  <div className="flex justify-center ">
                    {jobDetails.isRejected == true ||
                    jobDetails.isVerified ? null : (
                      <button
                        onClick={closeModal}
                        className="bg-green-500 ml-1 mt-4 w-1/5 text-white font-bold py-2 px-4 rounded"
                      >
                        OK
                      </button>
                    )}

                    {jobDetails.isVerified == false ? (
                      <button
                        onClick={rejectButton}
                        className="bg-red-500 ml-1 mt-4 w-1/5 text-white font-bold py-2 px-4 rounded"
                      >
                        Reject
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationList;
