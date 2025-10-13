import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import statesData from "../../data/states-and-districts.json";

const ProfilePage = () => {
    const navigate = useNavigate();

    const [user] = useState({
        name: "Alexa Rawles",
        memberId: "#32146897",
        email: "",
        mobile: "+91 8876543210",
        fatherName: "",
        motherName: "",
        avatar: "",
    });

    const [familyMembers] = useState([
        { id: 1, name: "Radheai Sharma", relation: "Father", avatar: "" },
        { id: 2, name: "Radharani Sharma", relation: "Mother", avatar: "" },
        { id: 3, name: "Radheal Sharma", relation: "Father", avatar: "" },
        { id: 4, name: "Radharani Sharma", relation: "Mother", avatar: "" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberRelation, setNewMemberRelation] = useState("");

    // Address modal states
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
    const [addressForm, setAddressForm] = useState({
        name: "",
        email: "",
        mobile: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        district: "",
        pincode: "",
        saveAs: "Home"
    });
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

    // Update districts when state changes
    useEffect(() => {
        if (addressForm.state) {
            const selectedState = statesData.states.find(s => s.state === addressForm.state);
            setAvailableDistricts(selectedState?.districts || []);
        } else {
            setAvailableDistricts([]);
        }
    }, [addressForm.state]);

    const handleAddressFormChange = (field: string, value: string) => {
        setAddressForm(prev => ({
            ...prev,
            [field]: value,
            // Reset district when state changes
            ...(field === 'state' ? { district: '' } : {})
        }));
    };

    const resetAddressForm = () => {
        setAddressForm({
            name: "",
            email: "",
            mobile: "",
            addressLine1: "",
            addressLine2: "",
            state: "",
            district: "",
            pincode: "",
            saveAs: "Home"
        });
    };

    const [addresses] = useState([
        {
            id: 1,
            type: "Home",
            name: "Dexter Morgan",
            phone: "+91 8518819091",
            address: "Jalan By Pass Ngurah Rai, Denpasar, Bali, 80228",
        },
    ]);

    return (
        <div className="min-h-screen bg-[#FFFFFF] lg:max-w-[1400px] mx-auto">
            {/* Header */}
            <header className="bg-[#FFFFFF] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b md:border-0">
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        aria-label="Go back"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-sm md:text-lg font-medium text-gray-900">Welcome, Amanda</h1>
                        <p className="text-xs text-gray-400">Tue, 07 June, 2022</p>
                    </div>
                </div>

                {/* <div className="hidden md:flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="Notifications">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-blue-600"></div>
                    </div>
                </div> */}
            </header>

            {/* Main Content */}
            <main className="px-4 md:px-6 py-4 md:py-6">
                {/* Profile Details Section */}
                <section className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 overflow-hidden">
                    {/* Red Header */}
                    <div className="bg-gradient-to-r from-[#AD2F16] to-[#8B0000] px-4 md:px-6 py-3 md:py-4">
                        <h2 className="text-white text-sm md:text-base font-normal">Profile Details</h2>
                    </div>

                    {/* Profile Content */}
                    <div className="px-4 md:px-6 py-6 md:py-8">
                        {/* Avatar and Name with Edit Button */}
                        <div className="flex flex-col md:flex-row items-start md:justify-between mb-6 md:mb-8 gap-4">
                            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                                <div className="relative">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-[#D05E2D]">
                                        <div className="w-full h-full bg-gray-300"></div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-md flex items-center justify-center text-white shadow-md" style={{ background: 'linear-gradient(90.44deg, #8B0000 0.41%, #AD2F16 99.66%)' }}>
                                        <span className="text-xs font-semibold">Pro</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-medium text-gray-900">{user.name}</h3>
                                    <p className="text-xs md:text-sm text-gray-400">Member ID: {user.memberId}</p>
                                </div>
                            </div>
                            <button className="hidden md:block bg-[#AD2F16] hover:bg-[#a03333] text-white px-8 py-2 rounded text-sm transition-colors">
                                Edit
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-5">
                            {/* Full Name */}
                            <div className="flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-400 text-sm focus:outline-none focus:border-gray-300"
                                    disabled
                                />
                            </div>

                            {/* Mobile No. */}
                            <div className="flex flex-col md:hidden">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Mobile No.
                                </label>
                                <input
                                    type="tel"
                                    defaultValue={user.mobile}
                                    className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-700 text-sm focus:outline-none focus:border-gray-300"
                                    disabled
                                />
                            </div>

                            {/* Email ID */}
                            <div className="flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Email ID
                                </label>
                                <input
                                    type="email"
                                    placeholder="Email ID"
                                    className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-400 text-sm focus:outline-none focus:border-gray-300"
                                    disabled
                                />
                            </div>

                            {/* Father's Name */}
                            <div className="flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Father's Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Father's name"
                                    className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-400 text-sm focus:outline-none focus:border-gray-300"
                                    disabled
                                />
                            </div>

                            {/* Mobile No. - Desktop only */}
                            <div className="hidden md:flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Mobile No.
                                </label>
                                <input
                                    type="tel"
                                    defaultValue={user.mobile}
                                    className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-700 text-sm focus:outline-none focus:border-gray-300"
                                    disabled
                                />
                            </div>

                            {/* Mother's Name (full width) */}
                            <div className="md:col-span-2 flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Mother's Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Mother's Name"
                                    className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-400 text-sm focus:outline-none focus:border-gray-300"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Family Details Section */}
                <section className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 px-4 md:px-6 py-4 md:py-6">
                    <div className="flex items-center justify-between mb-4 md:mb-5">
                        <h2 className="text-sm md:text-base font-medium text-gray-900">Family Details</h2>
                        <button
                            onClick={() => setIsAddMemberModalOpen(true)}
                            className="bg-red-50 text-[#b93a3a] text-xs md:text-sm font-medium px-2.5 md:px-3 py-1.5 rounded-md hover:bg-red-100"
                        >
                            +Add Members
                        </button>
                    </div>

                    {/* Mobile/Tablet: Vertical list of members */}
                    <div className="md:hidden space-y-3">
                        {familyMembers.slice(0, 3).map((member) => (
                            <div key={member.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                    <span className="text-base font-medium">{member.name[0]}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                                            <p className="text-xs text-gray-400">{member.relation}</p>
                                        </div>

                                        <button aria-label={`Remove ${member.name}`} className="w-5 h-5 flex items-center justify-center border border-gray-200 rounded-sm text-gray-500 hover:bg-gray-50 flex-shrink-0">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* View All button - Mobile */}
                        {familyMembers.length > 3 && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full text-center py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                View All
                            </button>
                        )}
                    </div>

                    {/* Desktop: Horizontal pill list - Show only first 3 members */}
                    <div className="hidden md:flex items-center justify-between overflow-x-auto pb-2">
                        {familyMembers.slice(0, 4).map((member) => (
                            <div key={member.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 min-w-[220px]">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                    <span className="text-base font-medium">{member.name[0]}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                                            <p className="text-xs text-gray-400">{member.relation}</p>
                                        </div>

                                        <button aria-label={`Remove ${member.name}`} className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded-sm text-gray-500 hover:bg-gray-50 flex-shrink-0">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* View All pill - Desktop - Only show if more than 3 members */}
                        {familyMembers.length > 3 && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center border border-gray-200 rounded-lg px-4 py-2 min-w-[110px] bg-white text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                View All
                            </button>
                        )}
                    </div>
                </section>

                {/* Family Members Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">All Family Members</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {familyMembers.map((member) => (
                                        <div key={member.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:shadow-sm transition-shadow">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                                <span className="text-lg font-medium">{member.name[0]}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                                                        <p className="text-xs text-gray-400">{member.relation}</p>
                                                    </div>

                                                    <button aria-label={`Remove ${member.name}`} className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded-sm text-gray-500 hover:bg-gray-50 flex-shrink-0">
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* My Address Section */}
                <section className="bg-white rounded-lg md:rounded-none shadow-sm md:shadow-none">
                    <div className="px-4 md:px-6 py-4 md:py-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm md:text-lg font-semibold text-gray-900">My Address</h2>
                            <button
                                onClick={() => setIsAddAddressModalOpen(true)}
                                className="bg-red-50 text-red-600 text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-md hover:bg-red-100 transition-colors"
                            >
                                +Add New Address
                            </button>
                        </div>
                    </div>

                    <div className="px-1 md:px-4 pb-4 md:py-6 space-y-3 md:max-w-[500px]">
                        {addresses.map((addr) => (
                            <div key={addr.id} className="border border-gray-200 rounded-lg p-3 md:p-4 bg-white hover:shadow-sm transition-shadow">
                                <div className="flex gap-3 md:gap-4 items-start">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 md:w-5 md:h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="12" cy="10" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs md:text-sm text-gray-500">Delivery address</span>

                                        </div>

                                        <p className="text-xs md:text-sm text-gray-900 font-medium mb-2 md:mb-3">
                                            {addr.address}
                                        </p>

                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs md:text-sm">
                                            <span className="text-gray-900 font-medium">{addr.name}</span>
                                            <span className="text-gray-400">{addr.phone}</span>
                                        </div>
                                    </div>

                                    {/* Right side: Home tag and Arrow - Desktop only */}
                                    <div className="flex flex-col items-end justify-between flex-shrink-0 h-full gap-10">
                                        <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded">
                                            {addr.type}
                                        </span>
                                        <div className="mt-2">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                                                <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>



                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Add Member Modal */}
                {isAddMemberModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                                <h3 className="text-2xl font-semibold text-gray-900">Add new member</h3>
                                <button
                                    onClick={() => {
                                        setIsAddMemberModalOpen(false);
                                        setNewMemberName("");
                                        setNewMemberRelation("");
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-6">
                                {/* Full Name Field */}
                                <div className="mb-6">
                                    <label className="block text-sm font-normal text-gray-900 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={newMemberName}
                                        onChange={(e) => setNewMemberName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    />
                                </div>

                                {/* Relation Field */}
                                <div className="mb-8">
                                    <label className="block text-sm font-normal text-gray-900 mb-2">
                                        Relation
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={newMemberRelation}
                                            onChange={(e) => setNewMemberRelation(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm appearance-none focus:outline-none focus:border-gray-300 focus:bg-white transition-colors cursor-pointer"
                                        >
                                            <option value="">Select relation</option>
                                            <option value="Father">Father</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Brother">Brother</option>
                                            <option value="Sister">Sister</option>
                                            <option value="Son">Son</option>
                                            <option value="Daughter">Daughter</option>
                                            <option value="Spouse">Spouse</option>
                                            <option value="Grandfather">Grandfather</option>
                                            <option value="Grandmother">Grandmother</option>
                                            <option value="Uncle">Uncle</option>
                                            <option value="Aunt">Aunt</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Member Button */}
                                <button
                                    onClick={() => {
                                        // Handle add member logic here
                                        console.log("Adding member:", { name: newMemberName, relation: newMemberRelation });
                                        setIsAddMemberModalOpen(false);
                                        setNewMemberName("");
                                        setNewMemberRelation("");
                                    }}
                                    className="w-full bg-[#AD2F16] hover:bg-[#8B0000] text-white font-medium py-3 rounded-lg transition-colors"
                                >
                                    Add Member
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add New Address Modal */}
                {isAddAddressModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                                <h3 className="text-base sm:text-xl font-semibold text-gray-900">Add New Address</h3>
                                <button
                                    onClick={() => {
                                        setIsAddAddressModalOpen(false);
                                        resetAddressForm();
                                    }}
                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-4 sm:px-6 py-4 sm:py-6">
                                {/* Name and Email Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Name"
                                            value={addressForm.name}
                                            onChange={(e) => handleAddressFormChange('name', e.target.value)}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="example@gmail.com"
                                            value={addressForm.email}
                                            onChange={(e) => handleAddressFormChange('email', e.target.value)}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Mobile Number */}
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                        Mobile No <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Enter Mobile Number"
                                        value={addressForm.mobile}
                                        onChange={(e) => handleAddressFormChange('mobile', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    />
                                </div>

                                {/* Address Line 1 */}
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                        Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Write address here"
                                        value={addressForm.addressLine1}
                                        onChange={(e) => handleAddressFormChange('addressLine1', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    />
                                </div>

                                {/* Address Line 2 */}
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Write address here"
                                        value={addressForm.addressLine2}
                                        onChange={(e) => handleAddressFormChange('addressLine2', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    />
                                </div>

                                {/* State and District Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                            State
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={addressForm.state}
                                                onChange={(e) => handleAddressFormChange('state', e.target.value)}
                                                className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-500 text-xs sm:text-sm appearance-none focus:outline-none focus:border-gray-300 focus:bg-white transition-colors cursor-pointer"
                                            >
                                                <option value="">Select State</option>
                                                {statesData.states.map((state) => (
                                                    <option key={state.state} value={state.state}>
                                                        {state.state}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                            District
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={addressForm.district}
                                                onChange={(e) => handleAddressFormChange('district', e.target.value)}
                                                disabled={!addressForm.state}
                                                className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-500 text-xs sm:text-sm appearance-none focus:outline-none focus:border-gray-300 focus:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Select District</option>
                                                {availableDistricts.map((district) => (
                                                    <option key={district} value={district}>
                                                        {district}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pincode */}
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Pincode"
                                        value={addressForm.pincode}
                                        onChange={(e) => handleAddressFormChange('pincode', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    />
                                </div>

                                {/* Save As */}
                                <div className="mb-5 sm:mb-6">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-2 sm:mb-3">
                                        Save as
                                    </label>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="saveAs"
                                                value="Home"
                                                checked={addressForm.saveAs === "Home"}
                                                onChange={(e) => handleAddressFormChange('saveAs', e.target.value)}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-700">Home</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="saveAs"
                                                value="Office"
                                                checked={addressForm.saveAs === "Office"}
                                                onChange={(e) => handleAddressFormChange('saveAs', e.target.value)}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-700">Office</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="saveAs"
                                                value="Other"
                                                checked={addressForm.saveAs === "Other"}
                                                onChange={(e) => handleAddressFormChange('saveAs', e.target.value)}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-700">Other</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Add Address Button */}
                                <button
                                    onClick={() => {
                                        // Handle add address logic here
                                        console.log("Adding address:", addressForm);
                                        setIsAddAddressModalOpen(false);
                                        resetAddressForm();
                                    }}
                                    className="w-full bg-[#AD2F16] hover:bg-[#8B0000] text-white font-medium py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    Add New Address
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;