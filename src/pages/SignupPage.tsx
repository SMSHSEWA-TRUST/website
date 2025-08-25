"use client";

import React, { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Call your signup API here
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

        {/* Right section (Signup Form) */}
        {/* Right section (Signup Form) */}
<div className="min-h-screen flex items-end justify-end px-6">
  <div className="bg-white/90 backdrop-blur-md rounded-t-3xl rounded-b-none px-10 py-6 w-full max-w-6xl shadow-2xl">
    
    {/* Top text */}
    <div className="mb-6 text-left">
      <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
      <p className="text-base text-gray-500 mt-2">
        Please enter your details to get started
      </p>
    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="space-y-8 w-full flex flex-col justify-center"
    >
      {/* Name */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">
          Your Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Johnson Doe"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-[439px] px-5 py-5 bg-white border border-gray-300 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all"
        />
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">
          Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          placeholder="9876543210"
          value={formData.mobile}
          onChange={handleChange}
          required
          className="w-full px-5 py-5 bg-white border border-gray-300 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">
          Email ID
        </label>
        <input
          type="email"
          name="email"
          placeholder="johnson@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-5 py-5 bg-white border border-gray-300 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all"
        />
      </div>

      {/* Submit Button */}
      <div className="py-6">
        <button
          type="submit"
          className="w-full bg-red-800 hover:bg-red-900 text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200"
        >
          GET STARTED
        </button>
      </div>
    </form>

    {/* Bottom text */}
    <p className="text-left text-gray-600 mt-6">
      Already have an account?{" "}
      <a
        href="/login"
        className="text-red-700 font-semibold hover:underline"
      >
        Login Here
      </a>
    </p>
  </div>
</div>

      </div>
    </div>
  );
}