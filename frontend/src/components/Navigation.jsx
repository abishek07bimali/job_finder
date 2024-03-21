import React, { useEffect, useRef, useState } from "react";
import "../style/navigationcss.css";
import nepal from "../images/flags/nepal.png";
import "../style/secondnavigation.css";
import logo from "../images/logos/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getNotificationApi, getSearchedJobsApi } from "../api/api";

const NavigationBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    setIsNotificationOpen(true);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      const data = {
        userId: user._id,
      };
      getNotificationApi(data).then((res) => {
        setNotifications([res.data.notification]);
      });
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (
        showSearchResults &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.className !== "search-input"
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, [showSearchResults]);

  const handleJobSearch = async (searchQuery) => {
    try {
      const response = await getSearchedJobsApi(searchQuery);
      const searchedJobs = response.data.jobs;
      setSearchResults(searchedJobs);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching jobs:", error);
    }
  };

  const handleSearchChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);

    if (newSearchQuery.trim() === "") {
      setShowSearchResults(false);
    } else {
      handleJobSearch(newSearchQuery);
    }
  };

  return (
    <>
      <div>
        {isNavOpen && <div className="overlay" onClick={toggleNav}></div>}
        <div className={`navbar ${isNavOpen ? "nav-open" : ""}`}>
          <div className="left-section">
            <div className="hamburger" onClick={toggleNav}>
              <i className={`fas ${isNavOpen ? "fa-times" : "fa-bars"}`}></i>
            </div>
            <nav className={isNavOpen ? "nav-open" : ""}>
              <Link className={isActiveLink("/") ? "active" : ""} to="/">
                Home
              </Link>
              <Link
                className={isActiveLink("/jobs") ? "active" : ""}
                to={"/jobs"}
              >
                Jobs
              </Link>
              {/* <a href="#">About Us</a> */}
              <Link                 className={isActiveLink("/contact") ? "active" : ""}
                to={"/contact"}>Contact</Link>
              <Link
                className={isActiveLink("/cvmaker") ? "active" : ""}
                to={"/cvmaker"}
              >
                CV Maker
              </Link>
            </nav>
          </div>
          <div className="right-section">
            <div className="language-selector">
              <select>
                <option value="english">English</option>
                <option value="nepali">नेपाली</option>
              </select>
              <img src={nepal} alt="Country Flag" />
            </div>
            <div className="phone-icon">
              <i className="fas fa-phone"></i>
            </div>
            <div className="phone-number">9815077699</div>
          </div>
        </div>
      </div>
      <div className="secondary-navbar">
        <div className="secondary-navbar1">
          <div className="left-section">
            <img className="logo" src={logo} alt="Logo" />
          </div>
          <div className="search-section relative">
            <div className="search-div relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2"></i>
              <input
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
                onFocus={() => setShowSearchResults(true)}
                className="search-input pl-8 pr-4 rounded-full focus:outline-none focus:shadow-outline border border-gray-300"
              />
            </div>
            {showSearchResults && (
              <div
                ref={dropdownRef}
                className="search-results-dropdown absolute z-10 mt-2 w-full max-h-90 overflow-y-auto bg-white border rounded-lg shadow-md"
              >
                {searchResults.map((job, index) => (
                  <div
                    key={index}
                    className="search-result-item p-1 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    <img
                      src={job.image}
                      alt={job.title}
                      className="w-12 h-12 mr-4 rounded-full"
                    />
                    <div>
                      <div className="text-red-500  font-semibold">
                        {job.companyName}
                      </div>
                      <div className="text-black font-bold">{job.jobTitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="right-section">
            {user ? (
              <>
                <Link to={"/user/profile"} className="signup-button text-white">
                  <h4 className="md-2">{user.firstName} </h4>
                </Link>

                {/* <button className="ml-5" onClick={handleNotificationClick}>
                  <i className="fa-solid text-green-500 fa-bell text-[22px]"></i>
                </button> */}
              </>
            ) : (
              <>
                <Link to={"/register"} className="signup-button">
                  Sign Up
                </Link>
                <Link to={"/login"} className="signup-button">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
