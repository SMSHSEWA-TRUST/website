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

      {/* Main container */}
      <div className="relative z-10 flex items-center justify-center w-full min-h-screen px-8">

        {/* Left section - Logo and text */}
        <div className="hidden lg:flex flex-col items-center text-white mr-16 max-w-md">
          {/* Logo - Centered */}
          <div className="w-24 h-24 mb-8">
            <img
              src="src/assets/images/Group 48095638.png"
              alt="Trust Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold mb-6 leading-tight text-center text-orange-100">
            Shree Mahakaleshwar Salasar <br />
            Hanuman Sewa Trust
          </h1>

          <p className="text-gray-200 text-sm leading-relaxed opacity-90 text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Right section - Login Form Card with proper height */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-sm shadow-2xl"
          style={{ height: '500px' }}>

          {/* Card content with proper vertical spacing */}
          <div className="h-full flex flex-col justify-between p-8">

            {/* Top section - Welcome text */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-sm text-gray-600">Please enter your mobile no. to continue Login</p>
            </div>

            {/* Middle section - Form */}
            <div className="flex-1 flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Johnson Doe"
                    value={mobileNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-800 hover:bg-red-900'} text-white py-3 rounded-lg font-semibold text-base transition-colors duration-200 mt-12`}
                >
                  {loading ? 'Sending...' : 'Sign In'}
                </button>
              </form>
            </div>

            {/* Bottom section - Sign up link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-red-700 font-semibold hover:underline">
                  Sign Up Here
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}