// signupScreen.jsx

import React, { useState } from 'react';
import { registerApi } from '../api/api';
import { toast } from 'react-toastify';
import {Navigate, useNavigate, Link } from "react-router-dom";

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDOB] = useState('');

  const navigate= useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    console.log(email, firstName, lastName, phone, address, password, confirmPassword, dob);

    const data = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      address: address,
      password: password,
      confirmPassword: confirmPassword,
      // dob: dob,
    };

    registerApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          navigate('/login');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-96">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-600 text-sm font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-600 text-sm font-semibold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-600 text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-600 text-sm font-semibold mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
            </div>
            {/* Add more rows as needed */}
          </div>
          {/* <div className="mb-4">
            <label htmlFor="dob" className="block text-gray-600 text-sm font-semibold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              onChange={(e) => setDOB(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          </div> */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-600 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 pr-10"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-600 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          </div>
          {/* Create Account button */}
          <button
            type="submit"
            onClick={submitForm}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
          >
            Create Account
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <Link to={"/login"} className="text-green-500 hover:underline cursor-pointer">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
