import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DonationCard {
    id: number;
    name: string;
    mahaNO: string;
    mobileNo: string;
    email: string;
    donationType: string;
    amount: string;
    time: string;
    date: string;
    paymentMode: string;
    paymentStatus: "Paid" | "Unpaid";
    donationId: string;
    bookedOn: string;
}

const DonationHistory = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<DonationCard | null>(null);

    const [donations] = useState<DonationCard[]>([
        {
            id: 1,
            name: "Mohan Lal",
            mahaNO: "+91 9876543210",
            mobileNo: "+91 9876543210",
            email: "mohanlal@gmail.com",
            donationType: "Bhumi Daan",
            amount: "₹1,25,000",
            time: "10:23 AM",
            date: "05/09/2025",
            paymentMode: "UPI",
            paymentStatus: "Paid",
            donationId: "#23164589",
            bookedOn: "10:23 AM · 15/09/2025",
        },
        {
            id: 2,
            name: "Mohan Lal",
            mahaNO: "+91 9876543210",
            mobileNo: "+91 9876543210",
            email: "mohanlal@gmail.com",
            donationType: "Bhumi Daan",
            amount: "₹1,25,000",
            time: "10:23 AM",
            date: "05/09/2025",
            paymentMode: "UPI",
            paymentStatus: "Paid",
            donationId: "#23164589",
            bookedOn: "10:23 AM · 15/09/2025",
        },
        {
            id: 3,
            name: "Mohan Lal",
            mahaNO: "+91 9876543210",
            mobileNo: "+91 9876543210",
            email: "mohanlal@gmail.com",
            donationType: "Bhumi Daan",
            amount: "₹1,25,000",
            time: "10:23 AM",
            date: "05/09/2025",
            paymentMode: "UPI",
            paymentStatus: "Paid",
            donationId: "#23164589",
            bookedOn: "10:23 AM · 15/09/2025",
        },
        {
            id: 4,
            name: "Mohan Lal",
            mahaNO: "+91 9876543210",
            mobileNo: "+91 9876543210",
            email: "mohanlal@gmail.com",
            donationType: "Bhumi Daan",
            amount: "₹1,25,000",
            time: "10:23 AM",
            date: "05/09/2025",
            paymentMode: "UPI",
            paymentStatus: "Paid",
            donationId: "#23164589",
            bookedOn: "10:23 AM · 15/09/2025",
        },
    ]);

    const handleViewDetails = (donation: DonationCard) => {
        setSelectedDonation(donation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDonation(null);
    };

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

                {/* <div className="flex items-center gap-3">
                    <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full" aria-label="Notifications">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-700"></div>
                    </div>
                </div> */}
            </header>

            {/* Main Content */}
            <main className="px-4 md:px-6 py-4 md:py-6">
                {/* Page Title Section with Red Header */}
                <section className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#AD2F16] to-[#8B0000] px-4 md:px-6 py-3 md:py-4">
                        <h2 className="text-white text-sm md:text-base font-normal">Donation History</h2>
                    </div>
                </section>

                {/* Donation Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {donations.map((donation) => (
                        <div
                            key={donation.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100"
                        >
                            {/* Card Content */}
                            <div className="space-y-3">
                                {/* Name */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Name</span>
                                    <span className="text-sm font-bold text-gray-900">{donation.name}</span>
                                </div>

                                {/* Maha No */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Maha No</span>
                                    <span className="text-sm font-bold text-gray-900">{donation.mahaNO}</span>
                                </div>

                                {/* Mobile No */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Mobile No</span>
                                    <span className="text-sm font-bold text-gray-900">{donation.mobileNo}</span>
                                </div>

                                {/* Email Id */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Email Id</span>
                                    <span className="text-sm font-bold text-gray-900 break-all">{donation.email}</span>
                                </div>

                                {/* Donation Type */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Donation Type</span>
                                    <span className="text-sm font-bold text-gray-900">{donation.donationType}</span>
                                </div>

                                {/* Amount */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Amount</span>
                                    <span className="text-sm font-bold text-gray-900">{donation.amount}</span>
                                </div>

                                {/* Time */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Time</span>
                                    <span className="text-sm font-bold text-gray-900">{donation.time}</span>
                                </div>

                                {/* Date */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Date</span>
                                    <span className="text-sm font-bold text-gray-900">{donation.date}</span>
                                </div>

                                {/* Payment Mode */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-400 font-normal">Payment Mode</span>
                                    <span className="text-sm font-bold text-gray-900">{donation.paymentMode}</span>
                                </div>

                                {/* Payment Status */}
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 font-normal">Payment Status</span>
                                    <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-white text-green-600 border border-green-600">
                                        {donation.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* View Details Button */}
                            <button
                                onClick={() => handleViewDetails(donation)}
                                className="w-full mt-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>

                {/* Empty State (if no donations) */}
                {donations.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donation History</h3>
                        <p className="text-sm text-gray-500">You don't have any donation history yet.</p>
                    </div>
                )}
            </main>

            {/* Donation Details Modal */}
            {isModalOpen && selectedDonation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Donation Details</h2>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close modal"
                            >
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Land 1 Details */}
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Land 1 Details</h3>

                                    <div className="space-y-4">
                                        {/* Donation ID */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Donation ID</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.donationId}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.name}</p>
                                            </div>
                                        </div>

                                        {/* Email ID & Mobile No */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Email ID</p>
                                                <p className="text-sm font-normal text-gray-900 break-all">{selectedDonation.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Mobile No.</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.mobileNo}</p>
                                            </div>
                                        </div>

                                        {/* Donation Type & Amount */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Donation Type</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.donationType}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.amount}</p>
                                            </div>
                                        </div>

                                        {/* Booked on */}
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Booked on</p>
                                            <p className="text-sm font-normal text-gray-900">{selectedDonation.bookedOn}</p>
                                        </div>

                                        {/* Payment Mode & Payment Status */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Payment Mode</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.paymentMode}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Payment Status</p>
                                                <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                                                    {selectedDonation.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Land 2 Details */}
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Land 2 Details</h3>

                                    <div className="space-y-4">
                                        {/* Donation ID */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Donation ID</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.donationId}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.name}</p>
                                            </div>
                                        </div>

                                        {/* Email ID & Mobile No */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Email ID</p>
                                                <p className="text-sm font-normal text-gray-900 break-all">{selectedDonation.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Mobile No.</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.mobileNo}</p>
                                            </div>
                                        </div>

                                        {/* Donation Type & Amount */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Donation Type</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.donationType}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.amount}</p>
                                            </div>
                                        </div>

                                        {/* Booked on */}
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Booked on</p>
                                            <p className="text-sm font-normal text-gray-900">{selectedDonation.bookedOn}</p>
                                        </div>

                                        {/* Payment Mode & Payment Status */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Payment Mode</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedDonation.paymentMode}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Payment Status</p>
                                                <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                                                    {selectedDonation.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationHistory;
