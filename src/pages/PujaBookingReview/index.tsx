import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookPooja, BasicDetails, ContactDetails, BookPoojaPayload, TimeSlot } from '@/services/pooja.service';
import { useMutation } from '@tanstack/react-query';

interface PujaBookingReviewPageProps {
    bookingData?: {
        selectedPujaType: string;
        selectedDate: Date | null;
        selectedTimeSlot?: string;
        fullName: string;
        gotra: string;
        nakshatra: string;
        sankalp: string;
        numberOfMembers: string;
        email: string;
        mobile: string;
        alternateMobile: string;
        address: string;
        pujaTypeDetails: string;
        specialRequests: string;
        prasadDelivery: string;
        personalizedMessage: string;
    };
    pujaTypeId?: string;
    amount?: number;
    isOpen?: boolean;
    onClose?: () => void;
    onBack?: () => void;
    onBookingSuccess?: (booking: any) => void;
}

export default function PujaBookingReviewPage({
    bookingData: propBookingData,
    pujaTypeId: propPujaTypeId,
    amount: propAmount,
    isOpen,
    onBack,
    onBookingSuccess
}: PujaBookingReviewPageProps = {}) {
    const navigate = useNavigate();
    const location = useLocation();

    // derive user name for header (same logic as other puja pages)
    let userName = 'Guest';
    try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.name === 'string' && parsed.name.trim().length > 0) userName = parsed.name;
        }
    } catch (e) {
        // ignore
    }

    // Get data from location state or props
    const locationState = location.state as any;
    const bookingData = locationState?.bookingData || propBookingData;
    const pujaTypeId = locationState?.pujaTypeId || propPujaTypeId || '';
    const amount = locationState?.amount || propAmount || 0;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate a unique booking ID
    const generateBookingId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `PB${timestamp}${random}`;
    };

    const bookPoojaMutation = useMutation({
        mutationFn: bookPooja,
        onSuccess: (response) => {
            console.log('Booking successful:', response);
            setIsLoading(false);

            // Normalize response payload - axios responses may wrap data
            const serverData = (response && (response as any).data) ? (response as any).data : response;
            const booking = serverData?.data || serverData;

            // Map server booking to confirmation card shape
            const mapped = {
                pujaType: bookingData?.pujaTypeDetails || booking?.pujaType || '',
                pujaDescription: booking?.pujaDescription || booking?.description || '',
                pujaImage: booking?.pujaImage || booking?.image || '',
                bookingId: booking?.bookingId || booking?._id || '',
                pujaDate: booking?.pujaDate ? new Date(booking.pujaDate).toLocaleDateString() : '',
                timeSlot: booking?.timeSlot ? `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}` : (booking?.timeSlot || ''),
                numberOfPeople: booking?.members || booking?.basicDetails?.noOfMembers || 1,
                includesPreshad: !!booking?.includesPrasad,
                userName: booking?.basicDetails?.name || booking?.userName || booking?.contactDetails?.name || bookingData?.fullName || '',
                phoneNumber: booking?.contactDetails?.mobileNumber || booking?.contactDetails?.mobile || bookingData?.mobile || '',
                bookingDate: booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : (new Date()).toLocaleDateString(),
                bookingTime: booking?.createdAt ? new Date(booking.createdAt).toLocaleTimeString() : (new Date()).toLocaleTimeString(),
            };

            if (onBookingSuccess) {
                onBookingSuccess(mapped);
            } else {
                // Navigate to confirmation page with booking data
                navigate('/puja-booking-confirmation', {
                    state: { bookingData: mapped },
                    replace: true
                });
            }
        },
        onError: (error: any) => {
            console.error('Booking failed:', error);
            setIsLoading(false);
            setError(error.response?.data?.message || 'Failed to book pooja. Please try again.');
        },
    });

    const handleProceedToPayment = async () => {
        if (!bookingData) {
            setError('Booking data is missing. Please go back and try again.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Parse number of members
            const memberCount = parseInt(bookingData.numberOfMembers) || 1;

            // Prepare basic details with name field
            const basicDetails: BasicDetails = {
                name: bookingData.fullName,
                gotra: bookingData.gotra,
                nakshatra: bookingData.nakshatra,
                sankalp: bookingData.sankalp,
                noOfMembers: memberCount,
                wantPrasadDelivery: bookingData.prasadDelivery === 'yes',
                personalizedMessage: bookingData.personalizedMessage,
            };

            // Prepare contact details
            const contactDetails: ContactDetails = {
                email: bookingData.email,
                mobileNumber: bookingData.mobile,
                alternateMobileNumber: bookingData.alternateMobile,
                address: bookingData.address,
            };

            // Use the user-selected puja date when available. Format as YYYY-MM-DD
            const formatDateOnly = (d: Date) => {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`; // e.g. 2025-10-30
            };

            let formattedPujaDate: string;
            if (bookingData.selectedDate) {
                const sel = new Date(bookingData.selectedDate);
                formattedPujaDate = formatDateOnly(sel);
            } else {
                // fallback to tomorrow (legacy behaviour) formatted as YYYY-MM-DD
                const pujaDate = new Date();
                pujaDate.setDate(pujaDate.getDate() + 1);
                formattedPujaDate = formatDateOnly(pujaDate);
            }

            // Parse the time slot to create startTime and endTime
            const timeSlot: TimeSlot = {
                startTime: bookingData.selectedTimeSlot || '09:00',
                endTime: bookingData.selectedTimeSlot
                    ? calculateEndTime(bookingData.selectedTimeSlot)
                    : '10:00'
            };

            // Prepare the complete payload
            const payload: BookPoojaPayload = {
                pujaType: pujaTypeId || bookingData.selectedPujaType,
                bookingId: generateBookingId(),
                pujaDate: formattedPujaDate,
                timeSlot: timeSlot,
                specialInstructions: bookingData.specialRequests,
                members: memberCount,
                includesPrasad: bookingData.prasadDelivery === 'yes',
                status: 'Pending',
                amount: amount,
                paymentStatus: 'Unpaid',
                basicDetails: basicDetails,
                contactDetails: contactDetails,
            };

            console.log('Booking payload:', payload);

            // Call the API
            bookPoojaMutation.mutate(payload);
        } catch (err) {
            console.error('Error preparing booking:', err);
            setIsLoading(false);
            setError('An error occurred. Please try again.');
        }
    };

    // Helper function to calculate end time (adds 1 hour to start time)
    const calculateEndTime = (startTime: string): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHours = (hours + 1) % 24;
        return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleGoBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/puja-booking', {
                state: {
                    bookingData,
                    pujaTypeId,
                    amount,
                    selectedPooja: { _id: pujaTypeId, title: bookingData?.pujaTypeDetails, price: amount }
                }
            });
        }
    };

   
    // If no booking data and not modal, redirect back to booking page
    if (!bookingData && !isOpen) {
        navigate('/puja-booking');
        return null;
    }

    if (isOpen === false) return null;

    const isModal = !!isOpen;

    return (
        <div className={isModal ? "" : "min-h-screen bg-gray-50"}>
            {/* Page Container */}
            <div className={isModal ? "" : "bg-white min-h-screen px-4 md:px-16   py-5 "}>
                {/* Header (hidden on modal) */}
                {!isModal && (
                    <div className='flex flex-col gap-2 mt-2 mb-2'>
                        <header className=" lg:flex sticky top-0 bg-[#FFFFFF]   items-center justify-between border-b md:border-0 ">
                            <div className="flex items-center gap-2 md:gap-4">
                                <button onClick={handleGoBack} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" aria-label="Go back">
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

                        <section className="bg-white rounded-lg shadow-sm  overflow-hidden">
                            <div className="bg-gradient-to-r from-[#AD2F16] to-[#8B0000] px-4 md:px-6 py-3 md:py-4">
                                <h2 className="text-white text-sm md:text-base font-normal">Pooja Booking - Review</h2>
                            </div>
                        </section>
                    </div>
                )}

                <div >
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Side - Basic & Contact Details */}
                        <div className="flex-1 space-y-6">
                            {/* Basic Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.fullName || 'Full Name'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gotra
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.gotra || 'Select Gotra'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nakshatra
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.nakshatra || 'Select Nakshatra'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sankalp
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.sankalp || 'Select Sankalp'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            No. of Members
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.numberOfMembers || '1'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email ID
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.email || 'example@gmail.com'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile No.
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.mobile || '+91 9876543210'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Alternate Mobile No.
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.alternateMobile || 'Not provided'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address*
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 min-h-[80px]">
                                            {bookingData.address || 'Address not provided'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Pooja Details & Prasad Delivery */}
                        <div className="flex-1 space-y-6">
                            {/* Pooja Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Pooja Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Selected Date
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.selectedDate
                                                ? bookingData.selectedDate.toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : 'No date selected'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Selected Time
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.selectedTimeSlot || 'No time selected'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pooja Type
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                            {bookingData.pujaTypeDetails || 'Pooja type not specified'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Special Requests
                                        </label>
                                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 min-h-[80px]">
                                            {bookingData.specialRequests || 'No special requests'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Prasad Delivery */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Prasad Delivery</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    (for those who want to offer virtual puja, delivery charges applied extra.)
                                </p>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        Do you want the Prasadam to be delivered at your address?
                                    </p>
                                    <div className="flex gap-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="prasadDeliveryReview"
                                                value="yes"
                                                checked={bookingData.prasadDelivery === 'yes'}
                                                readOnly
                                                className="w-4 h-4 text-[#8B0000] border-gray-300 focus:ring-[#8B0000]"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Yes</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="prasadDeliveryReview"
                                                value="no"
                                                checked={bookingData.prasadDelivery === 'no'}
                                                readOnly
                                                className="w-4 h-4 text-[#8B0000] border-gray-300 focus:ring-[#8B0000]"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">No</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Personalized Message (optional)
                                    </label>
                                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 min-h-[80px]">
                                        {bookingData.personalizedMessage || 'No personalized message'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Continue to Payment Button */}
                    <div className="mt-8">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        <button
                            onClick={handleProceedToPayment}
                            disabled={isLoading}
                            className="w-full bg-[#8B0000] hover:bg-[#6B1028] text-white py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Pooja Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}