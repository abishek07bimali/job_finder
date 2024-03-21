import React, { useState } from "react";
import { toast } from "react-toastify";
import { userMessageApi } from "../api/api";

const Contact = () => {
  // making usestate for state variables
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  // making a function to send the data from button


  const [fullNameerror, setFullNameerror] = useState("");
  const [emailerror, setEmailerror] = useState("");
  const [phoneNumerror, setPhoneNumerror] = useState("");
  const [addresserror, setAddresserror] = useState("");
  const [messageerror, setMessageerror] = useState("");

  // validation function
  const validate = () => {
    let isvalid = true;
    if (fullName.trim() === "") {
      setFullNameerror("Fullname is required");
    //   toast.warning(fullNameerror)
      isvalid = false;
    }
    if (email.trim() === "") {
      setEmailerror("Email is required");
    //   toast.warning(emailerror)
      isvalid = false;
    }
    if (phoneNum.trim() === "") {
      setPhoneNumerror("Phonenum is required");
    //   toast.warning(phoneNumerror)
      isvalid = false;
    }
    if (address.trim() === "") {
      setAddresserror("Address is required");
    //   toast.warning(addresserror)
      isvalid = false;
    }
    if (message.trim() === "") {
      setMessageerror("Message is required");
    //   toast.warning(messageerror)
      isvalid = false;
    }
    return isvalid;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
        toast.warning("Enter all filed")
        return false;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phoneNum", phoneNum);
    formData.append("address", address);
    formData.append("message", message);

    userMessageApi(formData)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setFullName("");
          setEmail("");
          setPhoneNum("");
          setAddress("");
          setMessage("");
        }
      })
      .catch((e) => {
        toast.error("Server Error!!!");
        console.log(e);
      });
  };

  return (
    <>
      <main className="flex flex-col w-full h-auto font-[poppins] text-black bg-[#F2F1F2]">
        {/* Contact Form Section */}
        <div className="md:w-[75%] w-[95%] mx-auto my-auto md:px-12 md:py-12 p-5 rounded-3xl md:mt-14 mt-0 bg-white">
          <p className="text-2xl text-green-500 font-bold ">Contact Us</p>
          <p className="text-md font-normal text-neutral-400">
            Your email address will not be provided.
          </p>
          <br />
          <form>
            <div className="flex flex-wrap w-full my-8 justify-between gap-y-8">
              <input
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setFullNameerror("");
                }}
                className="bg-neutral-200 px-3 py-2 rounded-md w-full md:w-[48%] outline-none"
                type="text"
                placeholder="Fullname"
              />
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailerror("");
                }}
                className="bg-neutral-200 px-3 py-2 rounded-md w-full md:w-[48%] outline-none"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-wrap w-full my-8 justify-between gap-y-8">
              <input
                value={phoneNum}
                onChange={(e) => {
                  setPhoneNum(e.target.value);
                  setPhoneNumerror("");
                }}
                className="bg-neutral-200 px-3 py-2 rounded-md w-full md:w-[48%] outline-none"
                type="number"
                placeholder="Phone number"
              />
              <input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setAddresserror("");
                }}
                className="bg-neutral-200 px-3 py-2 rounded-md w-full md:w-[48%] outline-none"
                type="text"
                placeholder="Address"
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setMessageerror("");
              }}
              className="w-full px-3 h-56 py-2 bg-neutral-200 rounded-md outline-none"
              name=""
              placeholder="Message"
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={handleContactSubmit}
                className="mt-5 px-6 py-3 bg-green-500 text-white font-bold rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Contact;
