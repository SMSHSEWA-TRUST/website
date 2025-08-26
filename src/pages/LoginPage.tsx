"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

    setLoading(true);

    try {
      const res = await fetch("https://api.smshsewatrust.com/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobileNumber }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        throw new Error(msg);
      }

      // On success, navigate to OTP and pass mobile (and response if needed)
      navigate("/otp", { state: { mobile: mobileNumber, server: data } });
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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

        {/* Right Section (Login Form) */}
        <div className="min-h-screen flex items-end justify-center px-6">
          <div className="bg-white/90 backdrop-blur-md rounded-t-3xl rounded-b-none px-0 py-10 w-full h-[80vh] max-w-5xl shadow-2xl">
            <div className="mb-6 text-left px-10 pt-0">
              <h2 className="text-3xl font- text-gray-900">Welcome Back</h2>
              <p className="text-base text-gray-500 mt-2">
                Please enter your mobile no. to continue Login
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-10 w-full px-10 py-10 flex-grow flex flex-col justify-center"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
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

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="py-10">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-800 hover:bg-red-900'} text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200`}
                >
                  {loading ? 'Sending...' : 'Sign In'}
                </button>
              </div>
            </form>

            <p className="text-left text-base text-gray-600 mt-6 px-20">
              Don't have an account?{" "}
              <a href="/signup" className="text-red-700 font-semibold hover:underline">
                Sign Up Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}