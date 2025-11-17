"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/images/Logo.png";
import FamilyBgImage from "../assets/images/loginBg.png";
import { updateFamilyDetails, FamilyDetails, FamilyDetailsPayload, getUserFromStorage, updateUserInStorage } from "../api/FamilyQueries";

export default function FamilyDetailsPage() {
    const navigate = useNavigate();

    // Family Details (no inputs in current UI)
    const familyDetails: { gotra?: string | null; nakshatra?: string | null; sankalp?: string | null } = {
        gotra: null,
        nakshatra: null,
        sankalp: null,
    };

    // Family Members State
    const [familyMembers, setFamilyMembers] = useState([
        { name: "", relation: "" }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Prevent body scrolling while this page is active so internal containers handle scrolling
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    // Sample dropdown options
    const relationOptions = [
        "Select Relation",
        "Father",
        "Mother",
        "Spouse",
        "Son",
        "Daughter",
        "Brother",
        "Sister",
        "Grandfather",
        "Grandmother",
        "Uncle",
        "Aunt",
        "Other"
    ];

    // Family Members handlers
    const handleFamilyMemberChange = (index: number, field: string, value: string) => {
        const updatedMembers = [...familyMembers];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setFamilyMembers(updatedMembers);
    };

    const addFamilyMember = () => {
        setFamilyMembers([...familyMembers, { name: "", relation: "" }]);
    };

    // (family details text fields removed from UI) - handler intentionally omitted

    // Validation function
    const validateFamilyDetails = () => {
        const validMembers = familyMembers.filter(member => member.name.trim() && member.relation);
        if (validMembers.length === 0) return "Please add at least one family member";

        for (const member of familyMembers) {
            if (member.name.trim() && !member.relation) {
                return "Please select a relation for all family members with names";
            }
            if (!member.name.trim() && member.relation) {
                return "Please enter a name for all family members with relations";
            }
        }
        return null;
    };

    // Skip family details
    const handleSkip = async () => {
        setError(null);
        setLoading(true);

        try {
            // Get user data from localStorage
            const user = getUserFromStorage();
            const userId = user?.id || user?._id;

            if (userId) {
                // Call API to mark family details as completed (even though skipped)
                // Use existing API function so it goes through shared axios/interceptors
                const payload = {
                    familyDetails: {
                        gotra: null,
                        nakshatra: null,
                        sankalp: null,
                        members: []
                    },
                    isFamilyDetailsAdded: true
                };

                try {
                    await updateFamilyDetails(userId, payload, true); // Skip toast for skip action
                } catch (e) {
                    // swallow error - we'll still update localStorage to avoid redirect loops
                    console.warn('Skip API call (updateFamilyDetails) failed (ignored):', e);
                }
            }

            // Update user data in localStorage but do NOT show success message for skip
            updateUserInStorage({ isFamilyDetailsAdded: true });

            // Clear the new signup flag
            localStorage.removeItem('isNewSignup');

            // Check if there's a saved redirect destination
            const redirectDestination = localStorage.getItem('auth_redirect_destination');

            if (redirectDestination) {
                try {
                    const parsed = JSON.parse(redirectDestination);
                    const intendedPath = parsed.path || '/';
                    const intendedState = parsed.state;

                    // Clear the saved destination
                    localStorage.removeItem('auth_redirect_destination');

                    // Redirect to the intended destination
                    navigate(intendedPath, {
                        replace: true,
                        state: intendedState
                    });
                } catch (error) {
                    console.error('Error parsing redirect destination:', error);
                    navigate("/", { replace: true });
                }
            } else {
                navigate("/", { replace: true });
            }
        } catch (err: any) {
            console.error("Error updating skip status:", err);
            // Even if API call fails, update localStorage to prevent redirect loop
            updateUserInStorage({ isFamilyDetailsAdded: true });

            // Clear the new signup flag
            localStorage.removeItem('isNewSignup');

            // Check if there's a saved redirect destination
            const redirectDestination = localStorage.getItem('auth_redirect_destination');

            if (redirectDestination) {
                try {
                    const parsed = JSON.parse(redirectDestination);
                    const intendedPath = parsed.path || '/';
                    const intendedState = parsed.state;

                    // Clear the saved destination
                    localStorage.removeItem('auth_redirect_destination');

                    // Redirect to the intended destination
                    navigate(intendedPath, {
                        replace: true,
                        state: intendedState
                    });
                } catch (error) {
                    console.error('Error parsing redirect destination:', error);
                    navigate("/", { replace: true });
                }
            } else {
                navigate("/", { replace: true });
            }
        } finally {
            setLoading(false);
        }
    };

    // Add family details
    const handleAddFamily = async () => {
        setError(null);
        setSuccess(null);

        const validationError = validateFamilyDetails();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            // Get user data from localStorage
            const user = getUserFromStorage();
            const userId = user?.id || user?._id;

            if (!userId) {
                throw new Error("User ID not found. Please login again.");
            }

            const validMembers = familyMembers.filter(member => member.name.trim() && member.relation !== "Select Relation");

            const familyData: FamilyDetails = {
                gotra: familyDetails.gotra || null,
                nakshatra: familyDetails.nakshatra || null,
                sankalp: familyDetails.sankalp || null,
                members: validMembers
            };

            const payload: FamilyDetailsPayload = {
                familyDetails: familyData,
                isFamilyDetailsAdded: true
            };

            // Call API to save family details using the service
            await updateFamilyDetails(userId, payload, true); // Skip automatic toast

            // Update user data in localStorage to reflect isFamilyDetailsAdded: true
            updateUserInStorage({ isFamilyDetailsAdded: true });

            // Clear the new signup flag
            localStorage.removeItem('isNewSignup');

            // Show custom success message
            setSuccess("Family details saved successfully!");

            setTimeout(() => {
                // Check if there's a saved redirect destination
                const redirectDestination = localStorage.getItem('auth_redirect_destination');

                if (redirectDestination) {
                    try {
                        const parsed = JSON.parse(redirectDestination);
                        const intendedPath = parsed.path || '/';
                        const intendedState = parsed.state;

                        // Clear the saved destination
                        localStorage.removeItem('auth_redirect_destination');

                        // Redirect to the intended destination
                        navigate(intendedPath, {
                            replace: true,
                            state: intendedState
                        });
                    } catch (error) {
                        console.error('Error parsing redirect destination:', error);
                        navigate("/", { replace: true });
                    }
                } else {
                    navigate("/", { replace: true });
                }
            }, 1500);

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
                backgroundImage: `url(${FamilyBgImage})`,
            }}
        >
            {/* Go Back/Home button */}
            {/* <button
                type="button"
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 z-30 bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded-md shadow-md flex items-center space-x-2 text-xs sm:px-4 sm:py-2 sm:rounded-lg sm:text-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Go to Home</span>
            </button> */}

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
                                    ADD DETAILS OF YOUR FAMILY MEMBERS
                                </p>
                                <h2 className="text-2xl font-bold text-gray-900">Family Members</h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="ml-4 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 hover:border-gray-400 px-3 py-1 rounded-md transition-colors duration-200"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Family Details */}
                        {/* <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gotra</label>
                                <input
                                    type="text"
                                    name="gotra"
                                    placeholder="Enter Gotra"
                                    value={familyDetails.gotra}
                                    onChange={handleFamilyDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nakshatra</label>
                                <input
                                    type="text"
                                    name="nakshatra"
                                    placeholder="Enter Nakshatra"
                                    value={familyDetails.nakshatra}
                                    onChange={handleFamilyDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sankalp</label>
                                <input
                                    type="text"
                                    name="sankalp"
                                    placeholder="Enter Sankalp"
                                    value={familyDetails.sankalp}
                                    onChange={handleFamilyDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div> */}

                        {/* Family Members */}
                        {familyMembers.map((member, index) => (
                            <div key={index} className="space-y-3">
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Name of Member"
                                            value={member.name}
                                            onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                                        <div className="relative">
                                            <select
                                                value={member.relation}
                                                onChange={(e) => handleFamilyMemberChange(index, 'relation', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all appearance-none pr-10"
                                            >
                                                {relationOptions.map((option, optionIndex) => (
                                                    <option key={optionIndex} value={optionIndex === 0 ? "" : option} disabled={optionIndex === 0}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addFamilyMember}
                            className="w-full py-3 text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Add Member</span>
                        </button>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
                        )}
                        {success && (
                            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{success}</div>
                        )}

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleAddFamily}
                                disabled={loading}
                                className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-800 hover:bg-red-900"} text-white py-3 rounded-lg font-semibold text-sm transition-colors duration-200`}
                            >
                                {loading ? "Saving..." : "Add Family Details"}
                            </button>
                        </div>
                    </div>
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
                <div className="flex items-end justify-center px-6 min-w-[500px]">
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl max-h-[600px] 3xl:max-h-full px-0 py-8 w-full max-w-2xl xl:max-w-3xl shadow-2xl flex flex-col">
                        <div className="mb-6 text-left px-8 xl:px-10 pt-0">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide font-medium">
                                        ADD DETAILS OF YOUR FAMILY MEMBERS
                                    </p>
                                    <h2 className="text-2xl xl:text-3xl font-bold text-gray-900">Family Members</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSkip}
                                    className="ml-4 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between px-8 xl:px-10 overflow-y-auto pr-3">
                            <div className="w-full space-y-4 lg:space-y-5">
                                {/* Family Details */}
                                {/* <div className="space-y-4 lg:space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Gotra</label>
                                        <input
                                            type="text"
                                            name="gotra"
                                            placeholder="Enter Gotra"
                                            value={familyDetails.gotra}
                                            onChange={handleFamilyDetailsChange}
                                            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Nakshatra</label>
                                        <input
                                            type="text"
                                            name="nakshatra"
                                            placeholder="Enter Nakshatra"
                                            value={familyDetails.nakshatra}
                                            onChange={handleFamilyDetailsChange}
                                            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Sankalp</label>
                                        <input
                                            type="text"
                                            name="sankalp"
                                            placeholder="Enter Sankalp"
                                            value={familyDetails.sankalp}
                                            onChange={handleFamilyDetailsChange}
                                            className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div> */}

                                {/* Family Members */}
                                {familyMembers.map((member, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Name of Member"
                                                    value={member.name}
                                                    onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                                    className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                                                <div className="relative">
                                                    <select
                                                        value={member.relation}
                                                        onChange={(e) => handleFamilyMemberChange(index, 'relation', e.target.value)}
                                                        className="w-full px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-900 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all appearance-none pr-10"
                                                    >
                                                        {relationOptions.map((option, optionIndex) => (
                                                            <option key={optionIndex} value={optionIndex === 0 ? "" : option} disabled={optionIndex === 0}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addFamilyMember}
                                    className="w-full py-3 lg:py-4 text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2 text-base lg:text-lg"
                                >
                                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Add Member</span>
                                </button>

                                {error && (
                                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mt-5">{error}</div>
                                )}
                                {success && (
                                    <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg mt-5">{success}</div>
                                )}

                                <div className="pt-6">
                                    <button
                                        type="button"
                                        onClick={handleAddFamily}
                                        disabled={loading}
                                        className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-800 hover:bg-red-900"} text-white py-5 rounded-xl font-semibold text-lg transition-colors duration-200`}
                                    >
                                        {loading ? "Saving..." : "Add Family Details"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}