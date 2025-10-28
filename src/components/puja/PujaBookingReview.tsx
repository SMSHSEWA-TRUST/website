import { X } from 'lucide-react';
import { useState } from 'react';
import { bookPooja, BasicDetails, ContactDetails, BookPoojaPayload, TimeSlot } from '../../services/pooja.service';
import { useMutation } from '@tanstack/react-query';

interface PujaBookingReviewProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onBookingSuccess?: (booking: any) => void;
    bookingData: {
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
}

export default function PujaBookingReview(props: PujaBookingReviewProps) {
    const { isOpen, onClose, bookingData, pujaTypeId = '', amount = 0 } = props;
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
                pujaType: bookingData.pujaTypeDetails || booking?.pujaType || '',
                pujaDescription: booking?.pujaDescription || booking?.description || '',
                pujaImage: booking?.pujaImage || booking?.image || '',
                bookingId: booking?.bookingId || booking?._id || '',
                pujaDate: booking?.pujaDate ? new Date(booking.pujaDate).toLocaleDateString() : '',
                timeSlot: booking?.timeSlot ? `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}` : (booking?.timeSlot || ''),
                numberOfPeople: booking?.members || booking?.basicDetails?.noOfMembers || 1,
                includesPreshad: !!booking?.includesPrasad,
                userName: booking?.basicDetails?.name || booking?.userName || booking?.contactDetails?.name || bookingData.fullName || '',
                phoneNumber: booking?.contactDetails?.mobileNumber || booking?.contactDetails?.mobile || bookingData.mobile || '',
                bookingDate: booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : (new Date()).toLocaleDateString(),
                bookingTime: booking?.createdAt ? new Date(booking.createdAt).toLocaleTimeString() : (new Date()).toLocaleTimeString(),
            };

            // Notify parent about successful booking so it can show confirmation
            if (props.onBookingSuccess) {
                props.onBookingSuccess(mapped);
            }
        },
        onError: (error: any) => {
            console.error('Booking failed:', error);
            setIsLoading(false);
            setError(error.response?.data?.message || 'Failed to book pooja. Please try again.');
        },
    });

    const handleProceedToPayment = async () => {
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

            // Calculate puja date (tomorrow)
            const pujaDate = new Date();
            pujaDate.setDate(pujaDate.getDate() + 1);
            const formattedPujaDate = pujaDate.toISOString();

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

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-900">Pooja Booking - Review Details</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left Side - Basic & Contact Details */}
                                <div className="flex-1 space-y-6">
                                    {/* Basic Details */}
                                    <div>

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
                                                    {bookingData.sankalp || 'Full Name'}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    No. of Members
                                                </label>
                                                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                                    {bookingData.numberOfMembers || 'Select Gotra'}
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
                                                    {bookingData.alternateMobile || '+91 9876543210'}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Address*
                                                </label>
                                                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 min-h-[80px]">
                                                    {bookingData.address || 'Lincoln Street, Park Avenue, Bangalore'}
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
                                                    {bookingData.pujaTypeDetails || 'Full Name'}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Special Requests
                                                </label>
                                                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 min-h-[80px]">
                                                    {bookingData.specialRequests || 'Write Special requests here'}
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
                                                {bookingData.personalizedMessage || 'Write message here'}
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
            )}

            {/* Confirmation handled by parent via onBookingSuccess */}
        </>
    );
}
