import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { forgetpasswordApi, resetpasswordApi, verifyOtpApi } from "../api/api";

const ForgetPassword = () => {
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setNewPassword] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isNewPasswordModalOpen, setIsNewPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openOtpModal = () => {
    setIsOtpModalOpen(true);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
  };

  const openNewPasswordModal = () => {
    setIsNewPasswordModalOpen(true);
  };

  const closeNewPasswordModal = () => {
    setIsNewPasswordModalOpen(false);
  };

  const submitEmail = (e) => {
    e.preventDefault();
    setLoading(true); 
    forgetpasswordApi({ email })
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          openOtpModal();
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitOtp = (e) => {
    e.preventDefault();
    const data = {
      email,
      otp,
    };
    verifyOtpApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          closeOtpModal();
          openNewPasswordModal();
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      
  };

  const submitNewPassword = (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    resetpasswordApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          closeNewPasswordModal();
          navigation("/login");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-96 relative">
        <h1 className="text-2xl font-bold mb-4">Forget Password</h1>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 text-sm font-semibold mb-2"
            >
              Enter your Valid Email Address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            type="button"
            onClick={submitEmail}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-green mb-4 relative"
          >
           {loading ? "Sending..." : "Verify"}
          </button>
        </form>

        {/* OTP Modal */}
        <Modal
          isOpen={isOtpModalOpen}
          onRequestClose={closeOtpModal}
          contentLabel="OTP Modal"
          className="fixed inset-0 grid place-items-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
        >
          <div className="relative mx-auto p-5 border max-w-2xl w-4/5 shadow-lg rounded-md bg-white">
            <div className="absolute top-2 right-2 ">
              <button
                onClick={closeOtpModal}
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-lg text-sm "
              >
                <i class="fa-solid fa-xmark p-2"></i>
              </button>
            </div>

            <form onSubmit={submitOtp}>
              <div className="m-4">
                <label
                  htmlFor="email"
                  className="block text-gray-600 text-sm font-semibold mb-2"
                >
                  Enter OTP Send to your email
                </label>
                <input
                  type="text"
                  value={otp}
                  placeholder="Enter OTP"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-green mb-4"
              >
                Submit OTP
              </button>
            </form>
          </div>
        </Modal>

        {/* New Password Modal */}
        <Modal
          isOpen={isNewPasswordModalOpen}
          onRequestClose={closeNewPasswordModal}
          contentLabel="New Password Modal"
          className="fixed inset-0 grid place-items-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
        >
          <div className="relative mx-auto p-5 border max-w-2xl w-4/5 shadow-lg rounded-md bg-white">
            <div className="absolute top-2 right-2 ">
              <button
                onClick={closeOtpModal}
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-lg text-sm "
              >
                <i class="fa-solid fa-xmark p-2"></i>
              </button>
            </div>
            <form onSubmit={submitNewPassword}>
              <div className="m-4">
                <label
                  htmlFor="email"
                  className="block text-gray-600 text-sm font-semibold mb-2"
                >
                  Enter New Password
                </label>

                <input
                  type="password"
                  value={password}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="New password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-green mb-4"
              >
                Submit New Password
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ForgetPassword;
