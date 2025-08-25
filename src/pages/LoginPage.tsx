"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Submitted:", { mobileNumber });
    // Call your login API here
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

      {/* Main container */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-7xl px-8">
        {/* Left section (Logo + Text) */}
        <div className="text-white max-w-lg text-center">
          {/* Logo */}
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

        {/* Right section (Login Form) */}
        <div className="min-h-screen flex items-end justify-center px-6">
       <div className="bg-white/90 backdrop-blur-md rounded-t-3xl rounded-b-none px-0 py-10 w-full h-[70vh] max-w-5xl shadow-2xl">

            
            {/* Top text */}
            <div className="mb-6 text-left px-10 pt-0">
              <h2 className="text-3xl font- text-gray-900">Welcome Back</h2>
              <p className="text-base  text-gray-500 mt-2">
                Please enter your mobile no. to continue Login
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-10 w-full px-10 py-10 flex-grow flex flex-col justify-center"
            >
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="mobile number"
                  value={mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-[433px] px-5 py-5 bg-white border border-gray-300 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="py-20">
                <button
                  type="submit"
                  className="w-full bg-red-800 hover:bg-red-900 text-white py-5 rounded-xl font-semibold text-.5xl transition-colors duration-200"
                >
                  Sign In
                </button>
              </div>
            </form>

            {/* Bottom text */}
            <p className="text-left text-base text-gray-600 mt-6 px-20">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-red-700 font-semibold hover:underline"
              >
                Sign Up Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
