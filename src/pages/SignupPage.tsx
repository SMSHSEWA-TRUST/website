"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Basic client-side validation
  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    const mobile = formData.mobile.replace(/\D/g, "");
    if (mobile.length < 10) return "Enter a valid mobile number";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Enter a valid email";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.smshsewatrust.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Try to surface an error message from the API if available
        const msg = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        throw new Error(msg);
      }

      setSuccess("Registered successfully. Redirecting to OTP verification...");

      // Navigate to OTP page, pass mobile in location state for convenience
      setTimeout(() => {
        navigate("/otp", { state: { mobile: formData.mobile } });
      }, 800);
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
      <div className="relative z-10 flex items-start justify-between w-full max-w-7xl px-8 pt-20">
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
        <div className="flex items-start justify-end w-full max-w-2xl">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl px-8 py-10 w-full max-w-lg shadow-2xl">

            {/* Top text */}
            <div className="mb-8 text-center">
              <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide font-medium">
                LET'S GET YOU STARTED
              </p>
              <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Johnson Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="johnson@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              {success && <div className="text-sm text-green-700">{success}</div>}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-800 hover:bg-red-900'} text-white py-3 rounded-lg font-semibold text-sm transition-colors duration-200`}
                >
                  {loading ? 'Submitting...' : 'GET STARTED'}
                </button>
              </div>
            </form>

            {/* Bottom text */}
            <p className="text-center text-gray-600 mt-4 text-sm">
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