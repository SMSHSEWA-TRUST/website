
import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPrasadOrderHistory } from "@/services/prasad.service";
import { useCancelOrder } from "@/api/PrasadQueries";

interface PrasadItem {
    prasadId: string;
    quantity: number;
    _id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    stock: number;
    isAvailable: boolean;
}

interface UserDetails {
    _id: string;
    memberId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface PrashadOrder {
    _id: string;
    user: UserDetails | string; // Handle both object and string cases if necessary, though JSON shows object
    subscription: string;
    prasad: PrasadItem[];
    prasadDetails?: any[]; // Keep for compatibility if needed, but we use 'prasad'
    orderId: string;
    note: string;
    status: string;
    address: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    paymentId: string;
    expectedDeliveryDate?: string;
}

const PrashadOrderHistory = () => {
    const navigate = useNavigate();
    const cancelOrder = useCancelOrder();
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

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.documentElement.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';
                document.documentElement.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isModalOpen]);

    const handleCancelOrder = (_orderId: string) => {
        console.log(_orderId)
        cancelOrder.mutate({ _id: _orderId });
        // toast('Cancel order API not implemented.', { position: 'top-center' });
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
                                    <span className="text-xs text-gray-400">Amount</span>
                                    <span className="font-bold">₹{order.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Status</span>
                                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Created At</span>
                                    <span className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                {order.expectedDeliveryDate && (
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-400">Expected Delivery</span>
                                        <span className="font-bold">{new Date(order.expectedDeliveryDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Prasad Items</span>
                                    <span className="font-bold">{order.prasad.length}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button onClick={() => handleViewDetails(order)} className="flex-1 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">View Details</button>
                                {order.status !== "cancelled" && <button onClick={() => handleCancelOrder(order._id)} className="py-2 px-3 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Cancel Order</button>}
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
                                            <p className="text-xs text-gray-400">Amount</p>
                                            <p className="text-sm font-semibold text-gray-900">₹{selectedOrder.amount}</p>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-400">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Created At</p>
                                            <p className="text-sm font-semibold text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                        </div>

                                        {selectedOrder.expectedDeliveryDate && (
                                            <div className="flex justify-between">
                                                <p className="text-xs text-gray-400">Expected Delivery</p>
                                                <p className="text-sm font-semibold text-gray-900">{new Date(selectedOrder.expectedDeliveryDate).toLocaleString()}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Payment ID</p>
                                            <p className="text-sm font-semibold text-gray-900 break-all">{selectedOrder.paymentId}</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-400">Shipping Address</p>
                                            <p className="text-sm font-semibold text-gray-900 break-all text-right">{selectedOrder.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right card - prasad items */}
                                <div className="flex flex-col">
                                    <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm flex-1">
                                        <div className="mb-4">
                                            <h3 className="text-sm font-semibold text-gray-900">Prasad Items</h3>
                                            {selectedOrder.prasad.length > 0 ? (
                                                <ul className="text-sm text-gray-700 mt-4 space-y-4">
                                                    {selectedOrder.prasad.map((item, index) => (
                                                        <li key={item._id || index} className="flex gap-4 items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                                            {item.images && item.images.length > 0 ? (
                                                                <img
                                                                    src={item.images[0]}
                                                                    alt={item?.name?.en}
                                                                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                                                                    No Image
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">{item?.name?.en}</p>
                                                                <div className="flex justify-between mt-1 items-center">
                                                                    <div className="text-xs text-gray-500">
                                                                        <span>{item.quantity} x ₹{item.price}</span>
                                                                    </div>
                                                                    <span className="font-semibold">₹{item.quantity * item.price}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500 mt-2">No prasad items</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        {selectedOrder.status !== "cancelled" && <button onClick={() => handleCancelOrder(selectedOrder._id)} className="w-full py-3 rounded-lg border border-red-300 text-red-600 bg-white hover:bg-red-50 flex items-center justify-center gap-2">
                                            {/* Red circular X icon */}
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                <circle cx="12" cy="12" r="10" fill="#FEE2E2" stroke="#F87171" strokeWidth="0" />
                                                <path d="M15.5 8.5 L8.5 15.5 M8.5 8.5 L15.5 15.5" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="font-medium">Cancel Order</span>
                                        </button>}
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
