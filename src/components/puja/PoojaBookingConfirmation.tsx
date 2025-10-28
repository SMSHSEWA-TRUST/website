import React from 'react';
import { X, Download, Users } from 'lucide-react';
import Barcode from 'react-barcode';
// Import local background image so bundler resolves the path correctly
import PoojaBookingImg from '../../assets/images/PoojaBooking.png';

interface PoojaBookingConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    bookingData: {
        pujaType: string;
        pujaDescription: string;
        pujaImage: string;
        bookingId: string;
        pujaDate: string;
        timeSlot: string;
        numberOfPeople: number;
        includesPreshad: boolean;
        userName: string;
        phoneNumber: string;
        bookingDate: string;
        bookingTime: string;
    };
}

const PoojaBookingConfirmation: React.FC<PoojaBookingConfirmationProps> = ({
    isOpen,
    onClose,
    bookingData,
}) => {

    if (!isOpen) return null;

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[1200px] " style={{ backgroundImage: `linear-gradient(180deg, #8B0000 0%, #AD2F16 100%)` }}>
                {/* Red gradient backdrop with temple PNG */}
                <div
                    className="rounded-3xl overflow-hidden shadow-2xl relative flex flex-col items-center"
                    style={{
                        // use imported image so build tools correctly include it
                        backgroundImage: `url(${PoojaBookingImg})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'bottom center',
                        backgroundSize: 'contain',
                        padding: '0',
                        minHeight: 600,
                    }}
                >

                    {/* Heading */}
                    <div className="relative z-10 w-full flex justify-between items-center px-8 pt-6 pb-4">
                        <h2 className="text-white text-xl font-bold">Pooja Booking Confirmation</h2>
                        <button
                            onClick={onClose}
                            className="text-white bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-all"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {/* Centered white receipt card with ticket notch */}
                    <div className="relative z-10 mx-auto w-full max-w-[550px] px-4 sm:px-6 flex flex-col items-center mt-2 mb-6">
                        {/* Ticket notch effect */}
                        {/* <div className="relative w-full">
                            <div className="absolute -top-2 left-0 w-5 h-5 bg-[#B22222] rounded-full" style={{ zIndex: 2 }} />
                            <div className="absolute -top-2 right-0 w-5 h-5 bg-[#B22222] rounded-full" style={{ zIndex: 2 }} />
                        </div> */}
                        <div className="bg-white rounded-2xl shadow-xl w-full overflow-visible relative" style={{ borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)' }}>
                            {/* Booking Receipt header */}
                            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                <span className="text-sm font-bold text-gray-800">Booking Receipt</span>
                                <span className="text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold shadow-sm">Booking Confirmed</span>
                            </div>
                            {/* Card content */}
                            <div className="px-5 pb-4">
                                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 text-white shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/20 border border-white/30">
                                            {bookingData.pujaImage ? (
                                                <img src={bookingData.pujaImage} alt={bookingData.pujaType} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs">Puja</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold">{bookingData.pujaType}</h3>
                                            <p className="text-xs text-white/90 mt-0.5 leading-relaxed">{bookingData.pujaDescription}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <div className="text-white/70 text-[10px] font-medium mb-0.5">Booking ID</div>
                                            <div className="font-bold text-sm">#{bookingData.bookingId}</div>
                                        </div>
                                        <div>
                                            <div className="text-white/70 text-[10px] font-medium mb-0.5">Time Slot</div>
                                            <div className="font-bold text-sm">{bookingData.timeSlot}</div>
                                        </div>
                                        <div>
                                            <div className="text-white/70 text-[10px] font-medium mb-0.5">Puja Date</div>
                                            <div className="font-bold text-sm">{bookingData.pujaDate}</div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={13} className="text-white/90" />
                                            <span className="font-bold text-sm">{bookingData.numberOfPeople}</span>
                                            {bookingData.includesPreshad && (
                                                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 text-white backdrop-blur-sm">Includes Prashad</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Ticket notch bottom */}
                            <div className="relative w-full h-0">
                                <div className="absolute -bottom-2 left-0 w-5 h-5 bg-[#B22222] rounded-full" style={{ zIndex: 2 }} />
                                <div className="absolute -bottom-2 right-0 w-5 h-5 bg-[#B22222] rounded-full" style={{ zIndex: 2 }} />
                            </div>
                            {/* Dashed divider */}
                            <div className="my-3 mx-5 border-t-2 border-dashed border-gray-200" />
                            {/* Details section */}
                            <div className="px-5 pt-2 pb-5">
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium mb-0.5">Name</div>
                                        <div className="font-bold text-gray-900 text-sm">{bookingData.userName}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 font-medium mb-0.5">Mobile Number</div>
                                        <div className="font-bold text-gray-900 text-sm">{bookingData.phoneNumber}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium mb-0.5">Booking Date</div>
                                        <div className="font-bold text-gray-900 text-sm">{bookingData.bookingDate}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 font-medium mb-0.5">Booking Time</div>
                                        <div className="font-bold text-gray-900 text-sm">{bookingData.bookingTime}</div>
                                    </div>
                                </div>
                                <div className="flex justify-center bg-white border border-gray-200 p-3 rounded-lg mb-3 shadow-sm">
                                    <Barcode
                                        value={bookingData.bookingId || 'NA'}
                                        height={50}
                                        width={1.5}
                                        fontSize={11}
                                        displayValue={true}
                                        margin={0}
                                    />
                                </div>
                                <p className="text-[11px] text-gray-600 text-center mb-4 px-3 leading-relaxed">Scan the code when you go for the puja, show this ticket to the temple officials before proceeding for the puja.</p>
                                <button
                                    onClick={handleDownload}
                                    className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
                                >
                                    <Download size={18} />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoojaBookingConfirmation;