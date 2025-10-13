import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const [memberships] = useState<MembershipCard[]>([
        {
            id: 1,
            status: "active",
            planType: "Plan Type",
            planName: "Ataliya Tri Maha",
            months: "3 Months",
            amount: "₹1,25,000",
            paymentMode: "UPI",
            paymentStatus: "Paid",
            validFrom: "10/09/25",
            validTill: "09/12/25",
        },
        {
            id: 2,
            status: "expired",
            planType: "Plan Type",
            planName: "Ataliya Tri Maha",
            months: "3 Months",
            amount: "₹1,25,000",
            paymentMode: "UPI",
            paymentStatus: "Paid",
            validFrom: "10/09/25",
            validTill: "09/12/25",
        },
        {
            id: 3,
            status: "expired",
            planType: "Plan Type",
            planName: "Ataliya Tri Maha",
            months: "3 Months",
            amount: "₹1,25,000",
            paymentMode: "UPI",
            paymentStatus: "Paid",
            validFrom: "10/09/25",
            validTill: "09/12/25",
        },
        {
            id: 4,
            status: "expired",
            planType: "Plan Type",
            planName: "Ataliya Tri Maha",
            months: "3 Months",
            amount: "₹1,25,000",
            paymentMode: "UPI",
            paymentStatus: "Paid",
            validFrom: "10/09/25",
            validTill: "09/12/25",
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
                {/* Page Title Section with Red Header */}
                <section className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#AD2F16] to-[#8B0000] px-4 md:px-6 py-3 md:py-4">
                        <h2 className="text-white text-sm md:text-base font-normal">Memberships History</h2>
                    </div>
                </section>

                {/* Membership Cards Grid */}
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

                {/* Empty State (if no memberships) */}
                {memberships.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Membership History</h3>
                        <p className="text-sm text-gray-500">You don't have any membership history yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MembershipHistory;
