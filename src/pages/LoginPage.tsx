"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LogoImage from "../assets/images/Logo.png";
import LoginBgImage from "../assets/images/loginBg.png"
import { useLogin } from "@/api/AuthQueries";

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const mobileDigits = mobileNumber.replace(/\D/g, "");
    if (mobileDigits.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    // use react-query mutation to call the service
    setLoading(true);
    let is404Redirect = false;

    try {
      const result: any = await loginMutation.mutateAsync({
        phone: mobileNumber,
        skipErrorToast: true // We'll handle the error toast manually
      });
      // result is expected to be the response data from the API (axios interceptor returns data)
      navigate("/otp", { state: { mobile: mobileNumber, server: result } });
    } catch (err: any) {
      // Check if error is 404 (user not found) and redirect to signup
      if (err?.response?.status === 404) {
        is404Redirect = true;
        // Keep loading state active during redirect
        setTimeout(() => {
          setLoading(false);
          navigate("/signup", { state: { phone: mobileNumber } });
        }, 1500); // Show toast for 1.5 seconds before redirecting
        return;
      }
      // For other errors, show the error message
      toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      // Only set loading to false if we're not in the 404 redirect flow
      if (!is404Redirect) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${LoginBgImage})`,
        }}>
        {/* Go to Home button (top-left) */}
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
            <div className="w-24 h-24 sm:w-32 sm:h-32 mb-6">
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
              Shri Mahakaleshwar Salasar Hanuman Seva Trust – a confluence of faith and service, with a resolve to preserve Sanatan culture.
            </p>
          </div>

          {/* Mobile Form */}
          <div className="bg-white/95 backdrop-blur-md rounded-t-3xl px-6 py-8 mx-4 mb-4 shadow-2xl max-h-[60vh] overflow-y-auto min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm sm:text-base text-gray-500 mt-2">
                Please enter your mobile no. to continue Login
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-800 hover:bg-red-900"
                    } text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200`}>
                  {loading ? "Sending..." : "Sign In"}
                </button>
              </div>
            </form>

            {/* <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
              Don't have an account?{" "}
              <a href="/signup" className="text-red-700 font-semibold hover:underline">
                Sign Up Here
              </a>
            </p> */}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="relative z-10 hidden lg:flex items-center justify-between w-full max-w-7xl px-8">
          {/* Left Section - Desktop */}
          <div className="text-white  text-center ">
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
            <p className="text-gray-200 textDescription leading-relaxed max-w-lg opacity-90 mx-auto ">
              Shri Mahakaleshwar Salasar Hanuman Seva Trust – a confluence of faith and service, with a resolve to preserve Sanatan culture.
            </p>
          </div>

          {/* Right Section - Desktop Form */}
          <div className=" flex items-end justify-center px-6  ">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl  px-0 py-8 w-full  max-w-2xl xl:max-w-3xl shadow-2xl flex flex-col ">
              <div className="mb-6 text-left px-8 xl:px-10 pt-0">
                <h2 className="textHeading font-bold text-gray-900">Welcome Back</h2>
                <p className="textDescription text-gray-500 mt-2">
                  Please enter your mobile no. to continue Login
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8 xl:px-10">
                <form onSubmit={handleSubmit} className="space-y-8 w-full">
                  <div>
                    <label className="block textDescription font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      placeholder="Enter your mobile number"
                      value={mobileNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
                  )}

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-800 hover:bg-red-900"
                        } text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200`}>
                      {loading ? "Sending..." : "Sign In"}
                    </button>
                  </div>
                </form>
              </div>

              {/* <p className="text-left textDescription text-gray-600 mt-6 px-8 xl:px-10">
                Don't have an account?{" "}
                <a href="/signup" className="text-red-700 textDescription  font-semibold hover:underline">
                  Sign Up Here
                </a>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
