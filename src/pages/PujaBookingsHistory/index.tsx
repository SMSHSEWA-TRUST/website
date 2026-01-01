import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { getPoojaHistory, cancelPooja } from "../../services/pooja.service";

interface BookingCard {
    _id: string;
    bookingId?: string;
    basicDetails?: {
        name?: string;
        gotra?: string;
        sankalp?: string;
        noOfMembers?: number;
        wantPrasadDelivery?: boolean;
        personalizedMessage?: string;
    };
    contactDetails?: {
        email?: string;
        mobileNumber?: string;
        alternateMobileNumber?: string;
        address?: string;
    };
    pujaType?: {
        _id?: string;
        title?: string;
        description?: string;
        imageUrl?: string;
    };
    pujaDate?: string;
    timeSlot?: {
        startTime?: string;
        endTime?: string;
    };
    specialInstructions?: string;
    members?: number;
    includesPrasad?: boolean;
    status?: string;
    amount?: number | string;
    paymentStatus?: string;
    createdAt?: string;
    [key: string]: any;
}

const PujaBookingsHistory = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingCard[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingCard | null>(null);

    useEffect(() => {
        let mounted = true;
        const fetchHistory = async () => {
            try {
                const res = await getPoojaHistory();
                // authTokenAxios interceptor returns response.data, and service defines data in res.data
                const data = res?.data ?? [];
                if (mounted) setBookings(data as unknown as BookingCard[]);
            } catch (err) {
                console.error("Failed to fetch puja booking history", err);
                // keep UI graceful; leave bookings as-is (empty or previously set)
            }
        };

        fetchHistory();

        return () => {
            mounted = false;
        };
    }, []);

    const openModal = (b: BookingCard) => {
        setSelectedBooking(b);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
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

    const cancelBooking = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await cancelPooja(id);
            setBookings(prev => prev.map(b => b._id === id ? { ...b, paymentStatus: 'Booking Cancelled' } : b));
            toast.success('Booking cancelled successfully.', { position: 'top-center' });
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            toast.error('Failed to cancel booking. Please try again.', { position: 'top-center' });
        }
        if (selectedBooking && selectedBooking._id === id) closeModal();
    };

    const getStatusBadgeClass = (status?: string) => {
        const s = (status || '').toLowerCase();
        if (s.includes('cancel')) return 'bg-red-50 text-red-600 border border-red-200';
        if (s === 'pending') return 'bg-yellow-50 text-yellow-700 border border-yellow-300';
        return 'bg-white text-green-600 border border-green-600';
    };

    let userName = 'Guest';
    try {
        const raw = localStorage.getItem('user');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.name === 'string' && parsed.name.trim().length > 0) userName = parsed.name;
        }
    } catch (e) {
        // ignore
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] lg:max-w-[1400px] mx-auto">
            <header className="bg-[#FFFFFF] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b md:border-0">
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" aria-label="Go back">
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
                        <h2 className="text-white text-sm md:text-base font-normal">Puja Bookings</h2>
                    </div>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {bookings.map((b: BookingCard) => (
                        <div key={b._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
                            <div className="space-y-3 text-gray-700 text-sm">
                                {b.bookingId && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Booking ID:</span>
                                        <span className="text-sm font-bold text-gray-900">{b.bookingId}</span>
                                    </div>
                                )}

                                {b.basicDetails?.name && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Name</span>
                                        <span className="text-sm font-bold text-gray-900">{b.basicDetails.name}</span>
                                    </div>
                                )}

                                {b.contactDetails?.mobileNumber && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Mobile No.</span>
                                        <span className="text-sm font-bold text-gray-900">{b.contactDetails.mobileNumber}</span>
                                    </div>
                                )}

                                {b.contactDetails?.email && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Email ID</span>
                                        <span className="text-sm font-bold text-gray-900 break-all">{b.contactDetails.email}</span>
                                    </div>
                                )}

                                {b.pujaType?.title && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Puja Type</span>
                                        <span className="text-sm font-bold text-gray-900">{b.pujaType.title?.en}</span>
                                    </div>
                                )}

                                {(b.amount !== undefined && b.amount !== null) && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Amount</span>
                                        <span className="text-sm font-bold text-gray-900">{typeof b.amount === 'number' ? `₹${b.amount}` : b.amount}</span>
                                    </div>
                                )}

                                {(b.timeSlot?.startTime) && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Time</span>
                                        <span className="text-sm font-bold text-gray-900">{b.timeSlot.startTime}{b.timeSlot.endTime ? ` - ${b.timeSlot.endTime}` : ''}</span>
                                    </div>
                                )}

                                {b.pujaDate && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Date</span>
                                        <span className="text-sm font-bold text-gray-900">{new Date(b.pujaDate).toLocaleDateString()}</span>
                                    </div>
                                )}

                                {b.paymentMode && (
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-normal">Payment Mode</span>
                                        <span className="text-sm font-bold text-gray-900">{b.paymentMode}</span>
                                    </div>
                                )}

                                {b.paymentStatus && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400 font-normal">Payment Status</span>
                                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(b.paymentStatus)}`}>
                                            {b.paymentStatus}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {(() => {
                                const isCancelled = ((b.status || '').toLowerCase() === 'cancelled') || ((b.paymentStatus || '').toLowerCase().includes('cancel'));
                                return (
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => openModal(b)} className="flex-1 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">View Receipt</button>
                                        {!isCancelled && (
                                            <button onClick={() => cancelBooking(b._id)} className="py-2 px-3 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Cancel Booking</button>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    ))}
                </div>

                {bookings.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                        <p className="text-sm text-gray-500">You don't have any puja bookings yet.</p>
                    </div>
                )}

                {/* Receipt Modal */}
                {isModalOpen && selectedBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Booking Receipt</h2>
                                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" aria-label="Close modal">
                                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedBooking.bookingId && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Booking ID</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedBooking.bookingId}</p>
                                            </div>
                                        )}

                                        {selectedBooking.basicDetails?.name && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedBooking.basicDetails.name}</p>
                                            </div>
                                        )}

                                        {selectedBooking.contactDetails?.mobileNumber && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Mobile No.</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedBooking.contactDetails.mobileNumber}</p>
                                            </div>
                                        )}

                                        {selectedBooking.contactDetails?.email && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Email ID</p>
                                                <p className="text-sm font-normal text-gray-900 break-all">{selectedBooking.contactDetails.email}</p>
                                            </div>
                                        )}

                                        {selectedBooking.pujaType?.title && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Puja Type</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedBooking.pujaType.title?.en}</p>
                                                {selectedBooking.pujaType?.imageUrl && (
                                                    <img src={selectedBooking.pujaType.imageUrl} alt={selectedBooking.pujaType.title?.name} className="mt-2 w-24 h-16 object-cover rounded" />
                                                )}
                                            </div>
                                        )}

                                        {(selectedBooking.amount !== undefined && selectedBooking.amount !== null) && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                                                <p className="text-sm font-normal text-gray-900">{typeof selectedBooking.amount === 'number' ? `₹${selectedBooking.amount}` : selectedBooking.amount}</p>
                                            </div>
                                        )}

                                        {selectedBooking.timeSlot?.startTime && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Time</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedBooking.timeSlot.startTime}{selectedBooking.timeSlot?.endTime ? ` - ${selectedBooking.timeSlot.endTime}` : ''}</p>
                                            </div>
                                        )}

                                        {selectedBooking.pujaDate && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Date</p>
                                                <p className="text-sm font-normal text-gray-900">{new Date(selectedBooking.pujaDate).toLocaleDateString()}</p>
                                            </div>
                                        )}

                                        {selectedBooking.paymentMode && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Payment Mode</p>
                                                <p className="text-sm font-normal text-gray-900">{selectedBooking.paymentMode}</p>
                                            </div>
                                        )}

                                        {selectedBooking.paymentStatus && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Payment Status</p>
                                                <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(selectedBooking.paymentStatus)}`}>
                                                    {selectedBooking.paymentStatus}
                                                </span>
                                            </div>
                                        )}

                                        {/* Additional sections: basic details & contact details expanded (render only when present) */}
                                        {selectedBooking.basicDetails?.gotra && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Gotra</p>
                                                <p className="text-sm text-gray-900">{selectedBooking.basicDetails.gotra}</p>
                                            </div>
                                        )}

                                        {selectedBooking.basicDetails?.sankalp && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Sankalp</p>
                                                <p className="text-sm text-gray-900">{selectedBooking.basicDetails.sankalp}</p>
                                            </div>
                                        )}

                                        {(selectedBooking.basicDetails?.noOfMembers !== undefined && selectedBooking.basicDetails?.noOfMembers !== null) && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">No. of Members</p>
                                                <p className="text-sm text-gray-900">{selectedBooking.basicDetails.noOfMembers}</p>
                                            </div>
                                        )}

                                        {(selectedBooking.basicDetails?.wantPrasadDelivery !== undefined) && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Prasad Delivery</p>
                                                <p className="text-sm text-gray-900">{selectedBooking.basicDetails.wantPrasadDelivery ? 'Yes' : 'No'}</p>
                                            </div>
                                        )}

                                        {selectedBooking.contactDetails?.alternateMobileNumber && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Alternate Mobile</p>
                                                <p className="text-sm text-gray-900">{selectedBooking.contactDetails.alternateMobileNumber}</p>
                                            </div>
                                        )}

                                        {selectedBooking.contactDetails?.address && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Address</p>
                                                <p className="text-sm text-gray-900">{selectedBooking.contactDetails.address}</p>
                                            </div>
                                        )}

                                        {selectedBooking.specialInstructions && (
                                            <div className="md:col-span-2">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Special Instructions</p>
                                                <p className="text-sm text-gray-900">{selectedBooking.specialInstructions}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PujaBookingsHistory;
