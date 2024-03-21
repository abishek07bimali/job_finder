import React, { useEffect, useState } from "react";
import { getMessageApi, replyMessageApi } from "../../api/api";
import AdminLayout from "../../components/AdminLayout";
import { set } from "date-fns";
import { toast } from "react-toastify";

const ViewMessage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [sortOrder, setSortOrder] = useState({ column: null, asc: true });
  const [contactList, setcontactList] = useState([]);

  useEffect(() => {
    getMessageApi(user._id)
      .then((res) => {
        if (res.data && res.data.contact) {
          // Add dynamic IDs to each contact
          const contactWithDynamicIds = res.data.contact.map(
            (contact, index) => ({
              ...contact,
              dynamicId: index + 1,
            })
          );
          setcontactList(contactWithDynamicIds);
          console.log("API response:", contactWithDynamicIds);
        } else {
          console.error("Invalid API response:", res);
        }
      })
      .catch((err) => {
        console.error("API request failed:", err);
      });
  }, []);

  const getColumnName = (columnIndex) => {
    const columnNames = ["id", "fullname", "phone", "email", "address"];
    return columnNames[columnIndex];
  };

  const sortTable = (columnIndex) => {
    const columnName = getColumnName(columnIndex);
    const isAscending = sortOrder.column === columnName ? !sortOrder.asc : true;

    const sortedData = [...contactList].sort((a, b) => {
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

    setcontactList(sortedData);
    setSortOrder({ column: columnName, asc: isAscending });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contactList.slice(indexOfFirstItem, indexOfLastItem);
  const pageNumbers = Math.ceil(contactList.length / itemsPerPage);

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

  const openModal = (id) => {
    setIsModalOpen(true);
  };
  const closeButton = () => {
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const alertDescription = (id) => {
    const job = contactList.find((jobs) => jobs._id === id);
    setJobDetails(job);
    openModal(id);
  };
  // handle email send as a reply

  const [message, setMessage] = useState("");
  const [messageerror, setMessageerror] = useState("");

  // validation function
  const validate = () => {
    let isvalid = true;
    
    if (message.trim() === "") {
      setMessageerror("Message is required");
      isvalid = false;
    }
    return isvalid;
  };

  const handleReply = (email) => {

    const isValid = validate();
    if (!isValid) {
      toast.warning("Message is required");
      return false;
    }

    const data = {
      message: message,
      email: email,
    };
    replyMessageApi(data).then((res) => {
      if (res.data.success) {
        toast.success("Email reply has been send to the user");
        closeModal();
        setMessage("")
      }
    });
  };

  return (
    <>
      <AdminLayout>
        <div className="bg-gray-800 ">
          <div class="rounded-tl-3xl bg-gradient-to-r from-green-900 to-blue-800 p-4 shadow text-2xl text-white ">
            <h3 className="font-bold pl-2">Message List</h3>
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
                  Fullname{" "}
                  {sortOrder.column === "fullname" &&
                    (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(2)}
                >
                  Phone{" "}
                  {sortOrder.column === "phone" && (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(3)}
                >
                  Email{" "}
                  {sortOrder.column === "company" &&
                    (sortOrder.asc ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(4)}
                >
                  Address{" "}
                  {sortOrder.column === "address" &&
                    (sortOrder.asc ? "↑" : "↓")}
                </th>
                {/* <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => sortTable(5)}
                >
                  Message{" "}
                </th> */}
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
                    {row.fullName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.phone}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.email}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.address}
                  </td>
                  {/* <td className="py-2 px-4 border-b">{row.message}</td> */}
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => alertDescription(row._id)}
                      title="View Details"
                      className="bg-green-700 m-1 text-white py-2 px-4 rounded mr-2"
                    >
                      <i class="fa-regular fa-eye text-[12px]"></i>
                    </button>
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
                  <div className="mr-5 text-left">
                    <p className="text-lg mb-2 font-bold">Message Details</p>

                    <p className="font-semibold">{jobDetails.message}</p>
                  </div>
                </div>
                <div className="justify-center ">
                  <textarea
                    className="w-full p-2 border rounded-md resize-none"
                    name="message"
                    id="message"
                    cols="30"
                    rows="5"
                    placeholder="Enter your message..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                       setMessageerror("");
                    }}
                  ></textarea>{" "}
                  <button
                    onClick={(e) => handleReply(jobDetails.email)}
                    className="bg-green-500 ml-1 mt-4 w-1/5 text-white font-bold py-2 px-4 rounded"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewMessage;
