import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  getAllApplicationCountApi,
  getAllJobsCountApi,
  getAllUserCountApi,
  getAllVerifiedUserApi,
  getApplicationCountIn7daysApi,
  getApplicationGrowthRateApi,
  getJobsCountIn7daysApi,
  getUserGrowthRateApi,
} from "../../api/api";

const Dashboard = () => {
  const [userGrowthData, setUserGrowthData] = useState({
    labels: [],
    datasets: [
      {
        label: "User Growth",
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        data: [],
      },
    ],
  });
  useEffect(() => {
    getUserGrowthRateApi().then((res) => {
      const data = res.data.data;
      const labels = data.map((item) => item.date);
      const count = data.map((item) => item.value);
      setUserGrowthData({
        labels: labels,
        datasets: [
          {
            label: "User Growth",
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.4)",
            data: count,
          },
        ],
      });
    });
  }, []);

  
  const [applicationGrowthData, setApplicationGrowthData] = useState({
    labels: [],
    datasets: [
      {
        label: "User Growth",
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        data: [],
      },
    ],
  });
  useEffect(() => {
    getApplicationGrowthRateApi().then((res) => {
      const data = res.data.data;
      const labels = data.map((item) => item.date);
      const count = data.map((item) => item.value);
      setApplicationGrowthData({
        labels: labels,
        datasets: [
          {
            label: "User Growth",
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.4)",
            data: count,
          },
        ],
      });
    });
  }, []);


  //
  // count the user data from the database
  //
  const [userCount, setUserCount] = React.useState(0);
  useEffect(() => {
    getAllUserCountApi().then((res) => {
      setUserCount(res.data.count);
    });
  }, []);

  // get all user count in past 7 days
  const [userCountData, setUserCountData] = useState(0);
  useEffect(() => {
    getAllApplicationCountApi().then((res) => {
      setUserCountData(res.data.count);
    });
  }, []);
  // get all verified users
  const [verifiedUserCount, setVerifiedUserCount] = useState(0);
  useEffect(() => {
    getAllVerifiedUserApi().then((res) => {
      setVerifiedUserCount(res.data.count);
    });
  }, []);

  //  count total jobs
  const [jobsCount, setJobsCount] = useState(0);
  useEffect(() => {
    getAllJobsCountApi().then((res) => {
      setJobsCount(res.data.count);
    });
  });

  // count all application
  const [applicationCount, setApplicationCount] = useState(0);
  useEffect(() => {
    getAllApplicationCountApi().then((res) => {
      setApplicationCount(res.data.count);
    });
  });

  // new application count
  const [newapplicationCount, setnewApplicationCount] = useState(0);
  useEffect(() => {
    getApplicationCountIn7daysApi().then((res) => {
      setnewApplicationCount(res.data.count);
    });
  });

  //  count jobs in last 7 days
  const [jobCountin7days, setJobCountin7days] = useState(0);
  useEffect(() => {
    getJobsCountIn7daysApi().then((res) => {
      setJobCountin7days(res.data.count);
    });
  });
  return (
    <AdminLayout>
      <div className="bg-gray-800 pt-30">
        <div className="rounded-tl-3xl bg-gradient-to-r from-blue-900 to-gray-800 p-4 shadow text-2xl text-white">
          <h3 className="font-bold pl-2">Admin Dashboard</h3>
        </div>
      </div>

      <div className="flex flex-wrap mt-8 w">
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-1/5">
                <i className="fas fa-chart-bar text-4xl text-blue-500"></i>
              </div>
              <div className="w-4/5 ml-4">
                <h4 className="text-xl font-semibold">Total Users</h4>
                <p className="text-3xl font-bold text-gray-800">{userCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-1/5">
                <i className="fas fa-users text-4xl text-purple-500"></i>
              </div>
              <div className="w-4/5 ml-4">
                <h4 className="text-xl font-semibold">New Users</h4>
                <p className="text-3xl font-bold text-gray-800">
                  {userCountData}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-1/5">
                <i className="fa-solid fa-briefcase text-4xl text-green-500"></i>
              </div>
              <div className="w-4/5 ml-4">
                <h4 className="text-xl font-semibold">Total Jobs</h4>
                <p className="text-3xl font-bold text-gray-800">{jobsCount}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-1/5">
                <i className="fa-regular fa-user text-4xl text-purple-500"></i>
              </div>
              <div className="w-4/5 ml-4">
                <h4 className="text-xl font-semibold">New Jobs</h4>
                <p className="text-3xl font-bold text-gray-800">{jobCountin7days}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-1/5">
                <i className="fa-regular fa-file text-4xl text-purple-500"></i>
              </div>
              <div className="w-4/5 ml-4">
                <h4 className="text-xl font-semibold">Total Application</h4>
                <p className="text-3xl font-bold text-gray-800">
                  {applicationCount}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-1/5">
                <i className="fa-regular fa-envelope text-4xl text-yellow-500"></i>
              </div>
              <div className="w-4/5 ml-4">
                <h4 className="text-xl font-semibold">New Application</h4>
                <p className="text-3xl font-bold text-gray-800">
                  {newapplicationCount}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-1/5">
                <i className="fa-solid fa-heart text-4xl text-purple-500"></i>
              </div>
              <div className="w-4/5 ml-4">
                <h4 className="text-xl font-semibold">Verified Users</h4>
                <p className="text-3xl font-bold text-gray-800">
                  {verifiedUserCount}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-1/5">
                <i className="fa-solid fa-message text-4xl text-green-500"></i>
              </div>
              <div className="w-4/5 ml-4">
                <h4 className="text-xl font-semibold">Total Reviews</h4>
                <p className="text-3xl font-bold text-gray-800">567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Line Graphs Section */}
      <div className="w-full sm:flex">
          {/* Left Line Graph */}
          <div className="flex-1 sm:mx-2 mb-4 sm:mb-0 bg-white rounded-lg p-4 shadow-md">
            <h4 className="text-xl font-semibold mb-4">User Growth (Daily)</h4>
            <Line data={userGrowthData} />
          </div>

          {/* Right Line Graph */}
          <div className="flex-1 sm:mx-2 bg-white rounded-lg p-4 shadow-md">
            <h4 className="text-xl font-semibold mb-4">
              Application Posts (Daily)
            </h4>
            <Line data={applicationGrowthData} />
          </div>
        </div>
    </AdminLayout>
  );
};

export default Dashboard;
