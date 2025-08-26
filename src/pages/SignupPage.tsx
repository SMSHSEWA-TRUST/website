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

        {/* Right Section (Signup Form) */}
        <div className="min-h-screen flex items-end justify-center px-6">
          <div className="bg-white/90 backdrop-blur-md rounded-t-3xl rounded-b-none px-0 py-8 w-full h-[85vh] max-w-5xl shadow-2xl flex flex-col">
            <div className="mb-4 text-left px-10 pt-0">
              <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide font-medium">
                LET'S GET YOU STARTED
              </p>
              <h2 className="text-3xl font- text-gray-900">Create an Account</h2>
            </div>

            <div className="flex-1 flex flex-col justify-between px-10">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 w-full"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Johnson Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="johnson@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
                {success && <div className="text-sm text-green-700">{success}</div>}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-800 hover:bg-red-900'} text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200`}
                  >
                    {loading ? 'Submitting...' : 'GET STARTED'}
                  </button>
                </div>
              </form>

              <p className="text-left text-base text-gray-600 mt-4 px-10">
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
    </div>
  );
}