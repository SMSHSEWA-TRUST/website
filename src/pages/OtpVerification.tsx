"use client";

import React, { useState } from "react";

export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill("")); // State for 6 OTP input fields
  const [phoneNumber, setPhoneNumber] = useState<string>("+91 9876543210"); // Placeholder phone number
  const [editMode, setEditMode] = useState<boolean>(false); // State to toggle phone number edit mode

  // Handles input change for OTP fields
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus on next input if a number is entered and not the last field
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  // Handles pasting of OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      // Optionally focus on the last input after paste
      const lastInput = document.getElementById(`otp-input-5`);
      if (lastInput) lastInput.focus();
    }
  };

  // Handles backspace key to clear and move to previous input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index !== 0) {
      // Fixed: Corrected the casting and method call for previousSibling
      (e.target as HTMLInputElement).previousSibling &&
        (e.target.previousSibling as HTMLInputElement).focus();
    }
  };

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP Submitted:", otp.join(""));
    // Call your OTP verification API here
  };

  // Toggles phone number edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Handles phone number change in edit mode
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        // Using the same background image as the login page for consistency
        backgroundImage: `url('https://placehold.co/1920x1080/000000/FFFFFF?text=Background+Image')`, // Placeholder
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Main container for the layout */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl px-8 py-12 md:py-0">
        {/* Left section (Logo + Text) - Replicated from Login Page */}
        <div className="text-white max-w-lg text-center md:text-left mb-12 md:mb-0 md:mr-12">
          {/* Logo */}
          <div className="w-24 h-24 mx-auto md:mx-0 mb-6">
            <img
              src="https://placehold.co/96x96/FF6347/FFFFFF?text=Logo" // Placeholder for Group 48095638.png
              alt="Trust Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight text-orange-100">
            Shree Mahakaleshwar Salasar <br />
            Hanuman Sewa Trust
          </h1>

          <p className="text-gray-200 text-sm leading-relaxed max-w-sm opacity-90 mx-auto md:mx-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Right section (OTP Verification Form) */}
        <div className="flex-1 flex items-center justify-center min-h-[50vh] md:min-h-screen md:items-center">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-16 w-full max-w-md shadow-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                OTP Verification
              </h2>
            </div>

            <p className="text-sm text-gray-700 mb-6 text-center">
              We have sent 6-Digit OTP to{" "}
              {editMode ? (
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="inline-block border-b border-gray-400 focus:outline-none focus:border-red-600 px-1 py-0.5 text-gray-900"
                />
              ) : (
                <span className="font-semibold text-gray-900">{phoneNumber}</span>
              )}
              <button
                type="button"
                onClick={toggleEditMode}
                className="ml-2 text-red-700 hover:text-red-900 focus:outline-none"
                aria-label={editMode ? "Save phone number" : "Edit phone number"}
              >
                {/* Using an SVG icon for edit/save */}
                {editMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-6.207 7.172a1 1 0 000 1.414L9.414 14l-2 2h4l2-2h2v-2l2-2V9.414l-2.707-2.707a1 1 0 00-1.414 0l-2.586 2.586zM4 17h12v2H4v-2z" />
                  </svg>
                )}
              </button>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex justify-center space-x-2 md:space-x-4">
                {otp.map((data, index) => {
                  return (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      name="otp"
                      maxLength={1}
                      className="w-10 h-10 md:w-12 md:h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all caret-red-600"
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={index === 0 ? handlePaste : undefined} // Only handle paste on the first input
                      required
                    />
                  );
                })}
              </div>

              {/* Resend OTP Link */}
              <p className="text-center text-gray-600 mt-4">
                <a href="#" className="text-red-700 font-semibold hover:underline">
                  Resend OTP
                </a>
              </p>

              {/* Verify OTP Button */}
              <button
                type="submit"
                className="w-full bg-red-800 hover:bg-red-900 text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200 mt-8"
              >
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
