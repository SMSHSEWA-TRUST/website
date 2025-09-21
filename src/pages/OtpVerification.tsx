"use client";

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoImage from "../assets/images/Logo.png";
import otpBgImage from "../assets/images/loginBg.png"

export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const resendOtp = async () => {
    setError(null);
    setSuccess(null);

    // Try to get mobile passed via navigation state (from login/signup)
    const mobile = (location.state as any)?.mobile || "";
    if (!mobile) {
      setError("Mobile number not available. Please go back and retry.");
      return;
    }

    setResendLoading(true);
    try {
      const res = await fetch("https://api.smshsewatrust.com/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        throw new Error(msg);
      }

      setSuccess("OTP resent successfully.");
      // Optionally update navigation state server data if needed
      // (location.state as any).server = data;
    } catch (err: any) {
      setError(err?.message || "Resend OTP failed");
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index !== 0) {
      const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement | null;
      prev?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      setOtp(pasteData.split(""));
      const lastInput = document.getElementById(`otp-input-5`);
      if (lastInput) lastInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const code = otp.join("").trim();
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    // Try to get mobile passed via navigation state (from login/signup)
    const mobile = (location.state as any)?.mobile || "";
    if (!mobile) {
      setError("Mobile number not available. Please go back and retry.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.smshsewatrust.com/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile, otp: code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        throw new Error(msg);
      }

      setSuccess("OTP verified. Redirecting...");
      //Stored token and user data in localStorage
      localStorage.setItem("authToken", data?.data?.accessToken || "");
      localStorage.setItem("refreshToken", data?.data?.refreshToken || "");
      localStorage.setItem("user", JSON.stringify(data?.data || {}));
      setTimeout(() => navigate("/", { replace: true }), 800);
    } catch (err: any) {
      setError(err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Get mobile number for display
  const displayMobile = (location.state as any)?.mobile || "";
  const maskedMobile = displayMobile ? `******${displayMobile.slice(-4)}` : "";

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${otpBgImage})`,
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
          <p className="text-gray-200 textDescription leading-relaxed max-w-xs opacity-90 text-center">
            With the blessings of Mahakal Baba and Salasar Balaji, our goal is to build a grand Mahadham in Surat by 2029.
            Our journey – to unite faith, expand service, and leave behind a spiritual legacy for the coming generations.
          </p>
        </div>

        {/* Mobile Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-t-3xl px-6 py-8 mx-4 mb-4 shadow-2xl max-h-[60vh] overflow-y-auto min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">OTP Verification</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Enter the 6-digit OTP sent to {maskedMobile || "your mobile number"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mobile OTP Inputs */}
            <div className="flex justify-center space-x-2 sm:space-x-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  name="otp"
                  maxLength={1}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  required
                />
              ))}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg text-center">
                {success}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-800 hover:bg-red-900"
                  } text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200`}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
            Didn't receive OTP?{" "}
            <button
              onClick={resendOtp}
              disabled={resendLoading}
              className={`text-red-700 font-semibold hover:underline ${resendLoading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 hidden lg:flex items-center justify-between w-full max-w-7xl px-8">
        {/* Left Section - Desktop */}
        <div className="text-white max-w-lg text-center xl:text-left">
          <div className="w-32 h-32 xl:w-40 xl:h-40 mx-auto xl:mx-0 mb-6">
            <img
              src={LogoImage}
              alt="Trust Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1
            className="text-3xl xl:text-4xl font-bold mb-6 leading-tight text-orange-100"
            style={{ color: '#fff', WebkitTextStroke: '1.2px #d35400' }}
          >
            Shree Mahakaleshwar Salasar <br />
            Hanuman Sewa Trust
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed max-w-sm opacity-90 mx-auto xl:mx-0">
            With the blessings of Mahakal Baba and Salasar Balaji, our goal is to build a grand Mahadham in Surat by 2029.
            Our journey – to unite faith, expand service, and leave behind a spiritual legacy for the coming generations
          </p>
        </div>

        {/* Right Section - Desktop Form */}
        <div className="min-h-screen flex items-end justify-center px-6">
          <div className="bg-white/90 backdrop-blur-md rounded-t-3xl rounded-b-none px-0 py-10 w-full h-[80vh] max-w-2xl xl:max-w-3xl shadow-2xl flex flex-col">
            <div className="mb-6 text-left px-8 xl:px-10 pt-0">
              <h2 className="text-2xl xl:text-3xl font-bold text-gray-900">OTP Verification</h2>
              <p className="text-base text-gray-500 mt-2">
                Enter the 6-digit OTP sent to {maskedMobile || "your mobile number"}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 xl:px-10 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-8 w-full">
                {/* Desktop OTP Inputs */}
                <div className="flex justify-center space-x-4">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      name="otp"
                      maxLength={1}
                      className="w-14 h-14 xl:w-16 xl:h-16 text-center text-xl xl:text-2xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                      value={data}
                      onChange={e => handleChange(e.target, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      required
                    />
                  ))}
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg text-center">
                    {success}
                  </div>
                )}

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-800 hover:bg-red-900"
                      } text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200`}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            </div>

            <p className="text-center text-base text-gray-600 mt-6 px-8 xl:px-10">
              Didn't receive OTP?{" "}
              <button
                onClick={resendOtp}
                disabled={resendLoading}
                className={`text-red-700 font-semibold hover:underline ${resendLoading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
