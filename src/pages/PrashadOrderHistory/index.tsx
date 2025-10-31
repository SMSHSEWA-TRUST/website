
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPrasadOrderHistory } from "@/services/prasad.service";

interface PrashadOrder {
    _id: string;
    orderId: string;
    name: string;
    mobileNo: string;
    email: string;
    prashadPack: string;
    amount: string;
    time: string;
    date: string;
    paymentMode: string;
    paymentStatus: string;
    boxContents?: string[];
    shippingAddress?: string;
    bookedOn?: string;
}

const PrashadOrderHistory = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedOrder, setSelectedOrder] = React.useState<PrashadOrder | null>(null);

    // API integration for prasad order history
    const { data, isLoading, isError } = useQuery({
        queryKey: ["prasadOrderHistory"],
        queryFn: getPrasadOrderHistory,
    });

    const orders: PrashadOrder[] = useMemo(() => {
        if (!data?.success || !Array.isArray(data.data)) return [];
        return data.data;
    }, [data]);

    const handleViewDetails = (order: PrashadOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    // TODO: Wire cancel API if available
    const handleCancelOrder = (_orderId: string) => {
        alert('Cancel order API not implemented.');
    };

    const getStatusBadgeClass = (status?: string) => {
        const s = (status || '').toLowerCase();
        if (s === 'pending') return 'bg-yellow-50 text-yellow-700 border border-yellow-300';
        if (s === 'rejected' || s === 'cancelled') return 'bg-red-50 text-red-600 border border-red-200';
        return 'bg-white text-green-600 border border-green-600';
    };

    let userName = 'Guest';
    try {
        const raw = localStorage.getItem('user');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.name === 'string' && parsed.name.trim().length > 0) {
                userName = parsed.name;
            }
        }
    } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    if (isError) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load order history.</div>;
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] lg:max-w-[1400px] mx-auto">
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
                        <h1 className="text-sm md:text-lg font-medium text-gray-900">Welcome, {userName}</h1>
                        <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>
            </header>

            <main className="px-4 md:px-6 py-4 md:py-6">
                <section className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#AD2F16] to-[#8B0000] px-4 md:px-6 py-3 md:py-4">
                        <h2 className="text-white text-sm md:text-base font-normal">Prashad Orders</h2>
                    </div>
                </section>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
                            <div className="space-y-2 text-gray-700 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Order ID:</span>
                                    <span className="font-bold">{order.orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Name</span>
                                    <span className="font-bold">{order.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Mobile No.</span>
                                    <span className="font-bold">{order.mobileNo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Email ID</span>
                                    <span className="font-bold break-all">{order.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Prashad Pack</span>
                                    <span className="font-bold">{order.prashadPack}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Amount</span>
                                    <span className="font-bold">{order.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Time</span>
                                    <span className="font-bold">{order.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Date</span>
                                    <span className="font-bold">{order.date}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Payment Mode</span>
                                    <span className="font-bold">{order.paymentMode}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Payment Status</span>
                                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button onClick={() => handleViewDetails(order)} className="flex-1 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">View Details</button>
                                <button onClick={() => handleCancelOrder(order._id)} className="py-2 px-3 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Cancel Order</button>
                            </div>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prashad Orders Found</h3>
                        <p className="text-sm text-gray-500">You haven't placed any prashad orders yet.</p>
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-6 md:p-8">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between p-6 md:p-8 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-900">Order Details</h2>
                            <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" aria-label="Close modal">
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left card - summary details */}
                                <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Order ID</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.orderId}</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Name</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.name}</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Email ID</p>
                                            <p className="text-sm text-gray-900 break-all">{selectedOrder.email}</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Mobile No.</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.mobileNo}</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Prashad Type</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.prashadPack}</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Amount</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.amount}</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Booked on</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.bookedOn || `${selectedOrder.time} - ${selectedOrder.date}`}</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Payment Mode</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.paymentMode}</p>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-400">Payment Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(selectedOrder.paymentStatus)}`}>
                                                {selectedOrder.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right card - box contents & shipping address */}
                                <div className="flex flex-col">
                                    <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm flex-1">
                                        <div className="mb-4">
                                            <h3 className="text-sm font-semibold text-gray-900">Box Contents</h3>
                                            <p className="text-sm text-gray-700 mt-2">{(selectedOrder.boxContents || []).join(', ')}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">Shipping Address</h3>
                                            <p className="text-sm text-gray-500 whitespace-pre-line mt-2">{selectedOrder.shippingAddress}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button onClick={() => handleCancelOrder(selectedOrder._id)} className="w-full py-3 rounded-lg border border-red-300 text-red-600 bg-white hover:bg-red-50 flex items-center justify-center gap-2">
                                            {/* Red circular X icon */}
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                <circle cx="12" cy="12" r="10" fill="#FEE2E2" stroke="#F87171" strokeWidth="0" />
                                                <path d="M15.5 8.5 L8.5 15.5 M8.5 8.5 L15.5 15.5" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="font-medium">Cancel Order</span>
                                        </button>
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

export default PrashadOrderHistory;
