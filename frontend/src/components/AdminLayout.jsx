import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import "../../style/adminNav.css";

const AdminLayout = ({ children }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDD = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (
      !event.target.matches(".drop-button") &&
      !event.target.matches(".drop-search")
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // console.log(user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleModel = (e) => {
    e.preventDefault();
    openModal();
  };
  const handleOk = () => {
    closeModal();
    handleLogout();
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <body className="bg-gray-800 font-sans leading-normal tracking-normal mt-10">
        <nav className="bg-gray-800 pt-2 md:pt-1 pb-1 px-1 mt-0 h-auto fixed w-full z-20 top-0 ">
          <div className="flex flex-wrap items-center">
            <div className="flex flex-shrink md:w-1/3 justify-end md:justify-start text-white">
              <Link to="#">
                <span className="text-xl pl-2">
                  <i class="fa-regular fa-face-smile text-white"></i>
                </span>
              </Link>
            </div>
            <div className="flex flex-1 md:w-1/3 justify-end md:justify-start text-white px-2">
              <span className="relative w-full">
                {/* <input type="search" placeholder="Search" className="w-64 bg-gray-900 text-white transition border border-transparent focus:outline-none focus:border-gray-400 rounded py-3 px-2 pl-10 appearance-none leading-normal" /> */}
              </span>
            </div>

            <div class="flex w-1/3 pt-2 content-center justify-between md:w-1/3 md:justify-end">
              <ul className="list-reset flex justify-between flex-1 md:flex-none items-center">
                <li className="flex-1 md:flex-none md:mr-3">
                  <div className="relative inline-block">
                    <button
                      onClick={toggleDD}
                      className="drop-button text-white focus:outline-none"
                    >
                      {" "}
                      <span className="pr-2">
                        <i class="fa-solid fa-user"></i>
                      </span>{" "}
                      Hi, {user.firstName}
                      <svg
                        className="h-3 fill-current inline"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </button>
                    <div
                      id="myDropdown"
                      className={`dropdownlist absolute bg-gray-800  text-white w-40 right-0 mt-3 p-4 bg-grey-500 overflow-auto ${
                        dropdownVisible ? "" : "invisible"
                      }`}
                    >
                      {/* <input type="text" className="drop-search p-2 text-gray-600" placeholder="Search.." id="myInput" /> */}
                      <Link
                        to="/user/profile"
                        className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block"
                      >
                        <i className="fa fa-user fa-fw"></i> Profile
                      </Link>
                      <Link
                        to="#"
                        className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block"
                      >
                        <i className="fa fa-cog fa-fw"></i> Settings
                      </Link>
                      <div className="border border-gray-800"></div>
                      <button
                        onClick={handleModel}
                        className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block"
                      >
                        <i className="fas fa-sign-out-alt fa-fw"></i> Log Out
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="flex flex-col md:flex-row ">
          <div class="bg-gray-800 shadow-xl h-16 fixed bottom-0 mt-12 md:relative md:h-screen z-10 w-full md:w-48 ">
            <div class="md:mt-12 md:w-48 md:fixed md:left-0 md:top-0 content-center md:content-start text-left justify-between">
              <ul className="list-reset flex flex-row md:flex-col py-0 md:py-3 px-1 md:px-2 text-center md:text-left overflow-x-auto">
                <li
                  className={`mr-3 flex-1  rounded pl-3 ${
                    isLinkActive("/admin/dashboard") ? "bg-green-500" : ""
                  }`}
                >
                  {user && user.isSuperAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white ${
                        isLinkActive("/admin/dashboard") ? "text-black" : ""
                      }`}
                    >
                      <i className="fas fa-tasks pr-0 md:pr-3 text-blue-500"></i>
                      <span className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">
                        Dashboard
                      </span>
                    </Link>
                  ) : null}
                </li>
                <li
                  className={`mr-3 flex-1 rounded pl-3 ${
                    isLinkActive("/admin/addjobs") ? "bg-green-500" : ""
                  }`}
                >
                  <Link
                    to="/admin/addjobs"
                    className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white ${
                      isLinkActive("/admin/addjobs") ? "text-black" : ""
                    }`}
                  >
                    <i className="fa fa-envelope pr-0 md:pr-3 text-blue-500"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">
                      Jobs
                    </span>
                  </Link>
                </li>
                <li
                  className={`mr-3 flex-1 rounded pl-3 ${
                    isLinkActive("/admin/message") ? "bg-green-500" : ""
                  }`}
                >
                  {user && user.isSuperAdmin ? (
                    <Link
                      to="/admin/message  "
                      className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white ${
                        isLinkActive("/admin/message   ") ? "text-black" : ""
                      }`}
                    >
                      <i className="fas fa-chart-area pr-0 md:pr-3 text-blue-500"></i>
                      <span className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">
                        {" "}
                        Message
                      </span>
                    </Link>
                  ) : null}
                </li>
                <li
                  className={`mr-3 flex-1 rounded pl-3 ${
                    isLinkActive("/admin/application") ? "bg-green-500" : ""
                  }`}
                >
                  <Link
                    to="/admin/application"
                    className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white ${
                      isLinkActive("/admin/application   ") ? "text-black" : ""
                    }`}
                  >
                    <i className="fa fa-wallet pr-0 md:pr-3 text-blue-500"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">
                      {" "}
                      Applications
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="main-content flex-1 bg-white-800 mt-10 md:mt-2 pb-24 md:pb-5">
            {children}
          </div>
        </div>
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
              <div className="text-center mt-5 ">
                <div className="mb-4">
                  <i className="fa-solid fa-info-circle text-red-500 text-4xl mb-2"></i>
                  {/* User information text */}
                  <p className="text-lg mb-4">
                    Are you sure you want to logout?
                  </p>
                </div>
                <button
                  onClick={handleOk}
                  className="bg-red-500 w-1/5  text-white font-bold py-2 px-4 rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </body>
    </>
  );
};

export default AdminLayout;
