import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMySubscriptions } from "@/api/SubscriptionQueries";

interface MembershipCard {
    id: number;
    status: "active" | "expired";
    planType: string;
    planName: string;
    months: string;
    amount: string;
    paymentMode: string;
    paymentStatus: "Paid" | "Unpaid";
    validFrom: string;
    validTill: string;
}

const MembershipHistory = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit] = useState(10);

    // Fetch subscriptions from API with pagination
    const { data: subscriptionsData, isLoading, isError } = useGetMySubscriptions(currentPage, pageLimit);

    // Extract data from API response (axios interceptor returns response.data)
    const apiSubscriptions = (subscriptionsData as any)?.data || [];
    const pagination = (subscriptionsData as any)?.pagination;

    console.log('API Response:', subscriptionsData); // Remove this when implementing actual data

    // Map API data to MembershipCard interface
    const memberships: MembershipCard[] = apiSubscriptions.length > 0
        ? apiSubscriptions.map((item: any) => ({
            id: item.id,
            status: item.status || (item.isActive ? "active" : "expired"),
            planType: item.planType || "Plan Type",
            planName: item.subscriptionName || item.name || "N/A",
            months: item.duration || item.months || "N/A",
            amount: item.amount ? `₹${item.amount}` : "N/A",
            paymentMode: item.paymentMode || "N/A",
            paymentStatus: item.paymentStatus || "Unpaid",
            validFrom: item.startDate || item.validFrom || "N/A",
            validTill: item.endDate || item.validTill || "N/A",
        }))
        : [];

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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
                {/* Page Title Section with Red Header */}
                <section className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#AD2F16] to-[#8B0000] px-4 md:px-6 py-3 md:py-4">
                        <h2 className="text-white text-sm md:text-base font-normal">Memberships History</h2>
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
                        <p className="text-red-600 font-medium">Failed to load membership history. Please try again later.</p>
                    </div>
                )}

                {/* Membership Cards Grid */}
                {!isLoading && !isError && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                        {memberships.map((membership) => (
                            <div
                                key={membership.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100"
                            >
                                {/* Status Badge */}
                                <div className="mb-4">
                                    <span
                                        className={`inline-block px-3 py-1.5 rounded-md text-xs font-semibold ${membership.status === "active"
                                            ? "bg-gradient-to-r from-[#8B0000] to-[#AD2F16] text-white"
                                            : "bg-black/25 text-white"
                                            }`}
                                    >
                                        {membership.status === "active" ? "Currently Active" : "Expired"}

                                    </span>

                                </div>

                                {/* Card Content */}
                                <div className="space-y-3">
                                    {/* Plan Type */}
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">{membership.planType}</span>
                                        <span className="text-sm font-bold text-gray-900">{membership.planName}</span>
                                    </div>

                                    {/* Months valid */}
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Months valid</span>
                                        <span className="text-sm font-bold text-gray-900">{membership.months}</span>
                                    </div>

                                    {/* Amount */}
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Amount</span>
                                        <span className="text-sm font-bold text-gray-900">{membership.amount}</span>
                                    </div>

                                    {/* Payment Mode */}
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Payment Mode</span>
                                        <span className="text-sm font-bold text-gray-900">{membership.paymentMode}</span>
                                    </div>

                                    {/* Payment Status */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400 font-normal">Payment Status</span>
                                        <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-white text-green-600 border border-green-600">
                                            {membership.paymentStatus}
                                        </span>
                                    </div>

                                    {/* Validity Details */}
                                    <div className="pt-3 border-t border-gray-200">
                                        <p className="text-sm font-bold text-gray-900 mb-3">Validity Details</p>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-400 font-normal">Valid From</p>
                                                <p className="text-xs text-gray-400 font-normal">Valid till</p>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <p className="text-sm font-bold text-gray-900">{membership.validFrom}</p>
                                                <p className="text-sm font-bold text-gray-900">{membership.validTill}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State (if no memberships) */}
                {!isLoading && !isError && memberships.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Memberships Found</h3>
                        <p className="text-sm text-gray-500 mb-1">You don't have any active or past memberships.</p>
                        <p className="text-xs text-gray-400">Explore our membership plans to get exclusive benefits and access.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && !isError && memberships.length > 0 && pagination && pagination.totalPages > 1 && (
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
        </div>
    );
};

export default MembershipHistory;
