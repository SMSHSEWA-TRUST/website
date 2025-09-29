"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/images/Logo.png";
import SignUpBgImage from "../assets/images/loginBg.png";
import { useRegister } from "@/api/AuthQueries";

export default function SignupPage() {
  const navigate = useNavigate();

  // User Details State
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();


  // User Details handlers
  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validation function
  const validateUserDetails = () => {
    if (!userDetails.name.trim()) return "Name is required";
    const phone = userDetails.phone.replace(/\D/g, "");
    if (phone.length < 10) return "Enter a valid phone number";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) return "Enter a valid email";
    if (userDetails.password.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userDetails.password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateUserDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const completeFormData = {
        ...userDetails,
        familyDetails: {
          gotra: null,
          nakshatra: null,
          sankalp: null,
          members: [],
        },
        isFamilyDetailsAdded: false,
      };

      const result: any = await registerMutation.mutateAsync(completeFormData);
      setSuccess("Registered successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login", { state: { phone: userDetails.phone, server: result } });
      }, 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step content renderer - Now only shows registration form
  const renderStepContent = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Johnson Doe"
            value={userDetails.name}
            onChange={handleUserDetailsChange}
            required
            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={userDetails.phone}
            onChange={handleUserDetailsChange}
            maxLength={10}
            required
            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Email ID</label>
          <input
            type="email"
            name="email"
            placeholder="johnson@gmail.com"
            value={userDetails.email}
            onChange={handleUserDetailsChange}
            required
            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={userDetails.password}
              onChange={handleUserDetailsChange}
              required
              className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all pr-12"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>
      </form>
    );
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${SignUpBgImage})`,
      }}
    >
      {/* Go to Home button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-30 bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded-md shadow-md flex items-center space-x-2 text-xs sm:px-4 sm:py-2 sm:rounded-lg sm:text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Go to Home</span>
      </button>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Mobile Layout */}
      <div className="relative z-10 w-full h-screen flex flex-col lg:hidden">
        {/* Mobile Header */}
        <div className="flex-1 flex flex-col items-center justify-center text-white px-6 py-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mb-6 flex items-center justify-center">
            <img
              src={LogoImage}
              alt="Trust Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-4 leading-tight text-orange-100 text-center"
            style={{ color: '#fff', WebkitTextStroke: '1.2px #d35400' }}
          >
            Shree Mahakaleshwar Salasar <br />
            Hanuman Sewa Trust
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed max-w-xs opacity-90 text-center">
            With the blessings of Mahakal Baba and Salasar Balaji, our goal is to build a grand Mahadham in Surat by 2029.
            Our journey – to unite faith, expand service, and leave behind a spiritual legacy for the coming generations
          </p>
        </div>

        {/* Mobile Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-t-3xl px-6 py-6 mx-4 mb-4 shadow-2xl max-h-[60vh] overflow-y-auto">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-medium">
                  LET'S GET YOU STARTED
                </p>
                <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {renderStepContent()}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
            )}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{success}</div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-800 hover:bg-red-900"} text-white py-3 rounded-lg font-semibold text-sm transition-colors duration-200`}
              >
                {loading ? "Submitting..." : "GET STARTED"}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-red-700 font-semibold hover:underline">
              Login Here
            </a>
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 hidden lg:flex items-center justify-between w-full max-w-7xl px-8">
        {/* Left Section */}
        <div className="text-white max-w-lg text-center xl:text-left">
          <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto mb-4 lg:mb-6 flex items-center justify-center">
            <img
              src={LogoImage}
              alt="Trust Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1
            className="text-3xl xl:text-4xl font-bold mb-6 leading-tight text-orange-100 text-center"
            style={{ color: '#fff', WebkitTextStroke: '1.2px #d35400' }}
          >
            Shree Mahakaleshwar Salasar <br />
            Hanuman Sewa Trust
          </h1>
          <p className="text-gray-200 textDescription leading-relaxed opacity-90 mx-auto text-center">
            With the blessings of Mahakal Baba and Salasar Balaji, our goal is to build a grand Mahadham in Surat by 2029.
            Our journey – to unite faith, expand service, and leave behind a spiritual legacy for the coming generations
          </p>
        </div>

        {/* Right Section - Desktop Form */}
        <div className=" flex items-end justify-center px-6 min-w-[500px]">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl max-h-[600px] 3xl:max-h-full px-0 py-8 w-full   max-w-2xl xl:max-w-3xl shadow-2xl flex flex-col">
            <div className="mb-6 text-left px-8 xl:px-10 pt-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide font-medium">
                    LET'S GET YOU STARTED
                  </p>
                  <h2 className="text-2xl xl:text-3xl font-bold text-gray-900">Create an Account</h2>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between px-8 xl:px-10 overflow-y-auto pr-3">
              <div className="w-full">
                {renderStepContent()}

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mt-5">{error}</div>
                )}
                {success && (
                  <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg mt-5">{success}</div>
                )}

                <div className="pt-6">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-800 hover:bg-red-900"} text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200`}
                  >
                    {loading ? "Submitting..." : "GET STARTED"}
                  </button>
                </div>
              </div>

              <p className="text-left text-base text-gray-600 mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-red-700 font-semibold hover:underline">
                  Login Here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
