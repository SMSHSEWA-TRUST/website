import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyDonations } from "@/api/DaanQueries";

interface DonationCard {
    id: number;
    name: string;
    mobileNo: string;
    email: string;
    donationType: string;
    daanType?: string;
    amount: string;
    time: string;
    date: string;
    paymentMode: string;
    paymentStatus: string;
    donationId: string;
    bookedOn: string;
}

const DonationHistory = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<DonationCard | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit] = useState(10);

    // Fetch donations from API
    const { data: donationsData, isLoading, isError } = useGetMyDonations(currentPage, pageLimit);

    // Extract data from API response (axios interceptor returns response.data)
    const apiDonations = (donationsData as any)?.data || [];
    const pagination = (donationsData as any)?.pagination;

    console.log('API Response:', donationsData); // Remove this when implementing actual data

    // Map API data to DonationCard interface
    const donations: DonationCard[] = apiDonations.length > 0
        ? apiDonations.map((item: any) => {
            // Parse createdAt date and time
            const createdDate = item.createdAt ? new Date(item.createdAt) : null;
            const formattedDate = createdDate ? createdDate.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : "N/A";
            const formattedTime = createdDate ? createdDate.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }) : "N/A";

            return {
                id: item._id || item.id,
                name: item.name || "N/A",
                mobileNo: item.phoneNumber || item.mobileNo || "N/A",
                email: item.email || "N/A",
                donationType: item.daanId?.title || item.donationType || "General Donation",
                daanType: item.daanType || undefined,
                amount: item.totalAmount ? `₹${item.totalAmount}` : "N/A",
                time: formattedTime,
                date: formattedDate,
                paymentMode: item.paymentMode || "N/A",
                paymentStatus: item.paymentStatus || "N/A",
                donationId: item._id || item.id || "N/A",
                bookedOn: createdDate ? createdDate.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : "N/A",
            };
        })
        : [];

    // Helper to compute badge classes based on payment status
    const getStatusBadgeClass = (status?: string) => {
        const s = (status || '').toLowerCase();
        if (s === 'pending') {
            return 'bg-yellow-50 text-yellow-700 border border-yellow-300';
        }
        if (s === 'reject' || s === 'rejected') {
            return 'bg-red-50 text-red-600 border border-red-200';
        }
        // default (success/other) - keep previous green style
        return 'bg-white text-green-600 border border-green-600';
    };

    const handleViewDetails = (donation: DonationCard) => {
        setSelectedDonation(donation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDonation(null);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Prevent background page from scrolling when modal is open
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = originalOverflow;
        }
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isModalOpen]);


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
                        {/* Read user name from localStorage 'user' JSON */}
                        {/** safe parse with fallback to 'Guest' **/}
                        {(() => {
                            let displayName = 'Guest';
                            try {
                                const raw = localStorage.getItem('user');
                                if (raw) {
                                    const parsed = JSON.parse(raw);
                                    if (parsed && typeof parsed.name === 'string' && parsed.name.trim().length > 0) {
                                        displayName = parsed.name;
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing user data from localStorage:', e);
                            }

                            const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

                            return (
                                <>
                                    <h1 className="text-sm md:text-lg font-medium text-gray-900">Welcome, {displayName}</h1>
                                    <p className="text-xs text-gray-400">{formattedDate}</p>
                                </>
                            );
                        })()}
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

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AD2F16]"></div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-medium">Failed to load donation history. Please try again later.</p>
                    </div>
                )}

                {/* Donation Cards Grid */}
                {!isLoading && !isError && (
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

                                    {/* Donation Title */}
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Donation Title</span>
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
                                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(donation.paymentStatus)}`}>
                                            {donation.paymentStatus?.toLowerCase() === 'completed' ? 'Approved' : donation.paymentStatus}
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
                )}

                {/* Empty State (if no donations) */}
                {!isLoading && !isError && donations.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donations Found</h3>
                        <p className="text-sm text-gray-500 mb-1">You haven't made any donations yet.</p>
                        <p className="text-xs text-gray-400">Start your journey by making your first donation to our cause.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && !isError && donations.length > 0 && pagination && pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${pagination.hasPrevPage
                                    ? 'text-gray-700 hover:bg-gray-50'
                                    : 'text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${pagination.hasNextPage
                                    ? 'text-gray-700 hover:bg-gray-50'
                                    : 'text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * pageLimit + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(currentPage * pageLimit, pagination.total)}
                                    </span> of{' '}
                                    <span className="font-medium">{pagination.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${pagination.hasPrevPage
                                            ? 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                            : 'cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            // Show first page, last page, current page, and pages around current page
                                            return page === 1 ||
                                                page === pagination.totalPages ||
                                                Math.abs(page - currentPage) <= 1;
                                        })
                                        .map((page, index, array) => {
                                            // Add ellipsis if there's a gap
                                            const prevPage = index > 0 ? array[index - 1] : 0;
                                            const showEllipsis = page - prevPage > 1;

                                            return (
                                                <div key={page} className="inline-flex">
                                                    {showEllipsis && (
                                                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                                                            ...
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handlePageChange(page)}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage
                                                            ? 'z-10 bg-[#AD2F16] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AD2F16]'
                                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </div>
                                            );
                                        })}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${pagination.hasNextPage
                                            ? 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                            : 'cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
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
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.name}</p>
                                    </div>

                                    {/* Mobile No */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Mobile No.</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.mobileNo}</p>
                                    </div>

                                    {/* Email ID */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Email ID</p>
                                        <p className="text-sm font-normal text-gray-900 break-all">{selectedDonation.email}</p>
                                    </div>

                                    {/* Donation Title */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Donation Title</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.donationType}</p>
                                    </div>

                                    {/* Donation Type - Only show if daanType exists */}
                                    {selectedDonation.daanType && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Donation Type</p>
                                            <p className="text-sm font-normal text-gray-900">{selectedDonation.daanType}</p>
                                        </div>
                                    )}

                                    {/* Amount */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.amount}</p>
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Time</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.time}</p>
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Date</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.date}</p>
                                    </div>

                                    {/* Booked on */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Booked on</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.bookedOn}</p>
                                    </div>

                                    {/* Payment Mode */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Payment Mode</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.paymentMode}</p>
                                    </div>

                                    {/* Payment Status */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Payment Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(selectedDonation.paymentStatus)}`}>
                                            {selectedDonation.paymentStatus?.toLowerCase() === 'completed' ? 'Approved' : selectedDonation.paymentStatus}
                                        </span>
                                    </div>

                                    {/* Donation ID */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Donation ID</p>
                                        <p className="text-sm font-normal text-gray-900">{selectedDonation.donationId}</p>
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
