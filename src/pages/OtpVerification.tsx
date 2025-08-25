"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index !== 0) {
      (e.target.previousSibling as HTMLInputElement)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      setOtp(pasteData.split(''));
      const lastInput = document.getElementById(`otp-input-5`);
      if (lastInput) lastInput.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP Submitted:", otp.join(""));
    // Navigate to next page after OTP verification
    // navigate("/dashboard"); // Uncomment and replace with actual page
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('src/assets/images/image (2).png')`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex items-center justify-between w-full max-w-7xl px-8">
        {/* Left Section */}
        <div className="text-white max-w-lg text-center">
          <div className="w-40 h-40 mx-auto mb-6">
            <img
              src="src/assets/images/Group 48095638.png"
              alt="Trust Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-tight text-orange-100">
            Shree Mahakaleshwar Salasar <br />
            Hanuman Sewa Trust
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed max-w-sm opacity-90 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Right Section (OTP Form) */}
        <div className="min-h-screen flex items-end justify-center px-6">
          <div className="bg-white/90 backdrop-blur-md rounded-t-3xl rounded-b-none px-0 py-10 w-full h-[70vh] max-w-5xl shadow-2xl">
            <div className="mb-6 text-left px-10 pt-0">
              <h2 className="text-3xl font- text-gray-900">OTP Verification</h2>
              <p className="text-base text-gray-500 mt-2">
                Enter the 6-digit OTP sent to your mobile number
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-10 w-full px-10 py-10 flex-grow flex flex-col justify-center"
            >
              {/* OTP Inputs */}
              <div className="flex justify-between space-x-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    name="otp"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    required
                  />
                ))}
              </div>

              <div className="py-10">
                <button
                  type="submit"
                  className="w-full bg-red-800 hover:bg-red-900 text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200"
                >
                  Verify OTP
                </button>
              </div>
            </form>

            <p className="text-left text-base text-gray-600 mt-6 px-20">
              Didn’t receive OTP?{" "}
              <a href="#" className="text-red-700 font-semibold hover:underline">
                Resend OTP
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}