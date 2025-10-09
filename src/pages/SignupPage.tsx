"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoImage from "../assets/images/Logo.png";
import SignUpBgImage from "../assets/images/loginBg.png";
import { useRegister } from "@/api/AuthQueries";
import statesData from "../data/states-and-districts.json";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // User Details State
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    state: "",
    district: "",
    pincode: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const registerMutation = useRegister();
  const [focusedSelect, setFocusedSelect] = useState<string | null>(null);

  // Auto-fill phone number if coming from login page
  // Auto-fill all user details if coming back from OTP page
  useEffect(() => {
    if (location.state?.phone) {
      setUserDetails(prev => ({ ...prev, phone: location.state.phone }));
    }
    // If coming back from OTP page with full user details
    if (location.state?.userDetails) {
      setUserDetails(location.state.userDetails);
    }
  }, [location.state]);


  // User Details handlers
  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // If state changes, clear district since district options will change
    if (name === "state") {
      setUserDetails({ ...userDetails, state: value, district: "" });
      return;
    }

    // sanitize inputs for specific fields
    if (name === "name") {
      // Allow letters, spaces, apostrophe, dot and hyphen. Limit length to 50.
      const sanitized = value.replace(/[^A-Za-z\s'.-]/g, '').slice(0, 50);
      setUserDetails({ ...userDetails, name: sanitized });
      return;
    }

    if (name === "phone") {
      // Allow only digits and limit to 10 characters
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setUserDetails({ ...userDetails, phone: digits });
      return;
    }

    if (name === "pincode") {
      // Allow only digits and limit to 6 characters
      const digits = value.replace(/\D/g, '').slice(0, 6);
      setUserDetails({ ...userDetails, pincode: digits });
      return;
    }

    setUserDetails({ ...userDetails, [name]: value });
  };

  // Validation function
  const validateUserDetails = () => {
    if (!userDetails.name.trim()) return "Name is required";
    // Name should be 2-50 characters and contain only allowed characters
    const nameRegex = /^[A-Za-z\s'.-]{2,50}$/;
    if (!nameRegex.test(userDetails.name.trim())) return "Enter a valid name (letters and spaces only)";

    const phone = userDetails.phone.replace(/\D/g, "");
    if (phone.length !== 10) return "Enter a valid 10-digit phone number";
    if (phone.charAt(0) === '0') return "Phone number must not start with 0";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) return "Enter a valid email";
    if (!userDetails.dob) return "Date of birth is required";
    if (!userDetails.state) return "State is required";
    if (!userDetails.district.trim()) return "District is required";
    if (!userDetails.pincode.trim()) return "Pin code is required";
    const pinCodeRegex = /^\d{6}$/;
    if (!pinCodeRegex.test(userDetails.pincode)) return "Enter a valid 6-digit pin code";
    if (!userDetails.address.trim()) return "Address is required";
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
      const result: any = await registerMutation.mutateAsync(userDetails);
      setSuccess("Registration successful. Redirecting to OTP verification...");
      setTimeout(() => {
        navigate("/otp", { state: { mobile: userDetails.phone, server: result, userDetails: userDetails } });
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
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={userDetails.dob}
            onChange={handleUserDetailsChange}
            required
            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Address</label>
          <textarea
            name="address"
            placeholder="Enter your full address"
            value={userDetails.address}
            onChange={handleUserDetailsChange}
            required
            rows={3}
            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">State</label>
          <div className="relative">
            <select
              name="state"
              value={userDetails.state}
              onChange={handleUserDetailsChange}
              onFocus={() => setFocusedSelect('state')}
              onBlur={() => setFocusedSelect(null)}
              required
              className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="">Select State</option>
              {statesData.states.map((s: any) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
            {/* Arrow icon - rotates when focused (select open) */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className={`h-4 w-4 text-gray-600 transform transition-transform duration-200 ${focusedSelect === 'state' ? 'rotate-180' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">District</label>
          <div className="relative">
            <select
              name="district"
              value={userDetails.district}
              onChange={handleUserDetailsChange}
              onFocus={() => setFocusedSelect('district')}
              onBlur={() => setFocusedSelect(null)}
              required
              className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="">Select District</option>
              {(() => {
                // find districts for selected state from JSON
                const stateObj = statesData.states.find((s: any) => s.state === userDetails.state);
                const districts: string[] = stateObj ? stateObj.districts : [];
                return districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ));
              })()}
            </select>
            {/* Arrow icon - rotates when focused (select open) */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className={`h-4 w-4 text-gray-600 transform transition-transform duration-200 ${focusedSelect === 'district' ? 'rotate-180' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Pin Code</label>
          <input
            type="text"
            name="pincode"
            placeholder="Enter 6-digit pin code"
            value={userDetails.pincode}
            onChange={handleUserDetailsChange}
            maxLength={6}
            pattern="[0-9]{6}"
            required
            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
          />
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
                {loading ? "Submitting..." : "Verify OTP"}
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
                    {loading ? "Submitting..." : "Verify OTP"}
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
