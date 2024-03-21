
import React from 'react';
import '../style/secondnavigation.css'; 
import logo from '../images/logos/logo.png';
import { Link } from 'react-router-dom';

const SecondaryNavigationBar = () => {
  
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  return (
    <div className="secondary-navbar">
      <div className="secondary-navbar1">
        <div className="left-section">
          <img className="logo" src={logo} alt="Logo" />
        </div>
        <div className="search-section">
          <div className="search-div">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="right-section">
        {user ? (<>
          {/* <button className="">{user.firstName} </button> */}
          <h4 className='md-2'>{user.firstName} </h4>

        </>
        ) : (
          <>
          <Link to={"/register"} className="signup-button">Sign Up</Link>
          </>
        )}
          <button className="post-job-button">Post Job</button>

        </div>
      </div>
    </div>
  );
};

export default SecondaryNavigationBar;
