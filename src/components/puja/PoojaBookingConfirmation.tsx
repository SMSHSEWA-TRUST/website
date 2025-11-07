import React, { useRef } from 'react';
import { X, Download, Users } from 'lucide-react';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
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
    const cardRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const original = cardRef.current;

            // Clone the card so we do not modify or flicker the visible UI
            const clone = original.cloneNode(true) as HTMLElement;

            // Remove any elements we don't want in the captured image (button marked with data-capture-ignore)
            clone.querySelectorAll('[data-capture-ignore]').forEach((el) => el.remove());

            // Match the original size so the captured image aligns with what's shown
            const rect = original.getBoundingClientRect();
            clone.style.width = `${Math.round(rect.width)}px`;
            clone.style.height = `${Math.round(rect.height)}px`;

            // Place the clone off-screen but in the document so html2canvas can render it
            clone.style.position = 'fixed';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            clone.style.zIndex = '9999';
            // Ensure clone is visible (not display:none) for html2canvas
            clone.style.display = 'block';
            clone.style.overflow = 'visible';

            document.body.appendChild(clone);

            // Wait for fonts to load for more accurate rendering (if supported)
            if ((document as any).fonts && (document as any).fonts.ready) {
                try {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    await document.fonts.ready;
                } catch (e) {
                    // ignore font loading errors and proceed
                }
            }

            // Wait for any images inside the clone to load to avoid missing images
            const imgs = Array.from(clone.querySelectorAll('img')) as HTMLImageElement[];
            if (imgs.length) {
                await Promise.all(imgs.map((img) => {
                    return new Promise<void>((resolve) => {
                        if (img.complete) return resolve();
                        const onDone = () => {
                            img.removeEventListener('load', onDone);
                            img.removeEventListener('error', onDone);
                            resolve();
                        };
                        img.addEventListener('load', onDone);
                        img.addEventListener('error', onDone);
                        // In some cases the browser won't begin loading off-screen cloned images; set src again to nudge it.
                        try {
                            const src = img.getAttribute('src');
                            if (src) img.src = src;
                        } catch (e) {
                            // ignore
                        }
                    });
                }));
            }

            // Small pause to allow styles to compute for the clone
            await new Promise((r) => setTimeout(r, 50));

            // Capture the off-screen clone to avoid altering the real UI
            const canvas = await html2canvas(clone, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: false, // avoid tainting the canvas where possible
                imageTimeout: 15000,
            });

            // Clean up the clone from the DOM
            document.body.removeChild(clone);

            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Pooja-Booking-${bookingData.bookingId}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } else {
                    console.error('Failed to create blob from canvas.');
                }
            });
        } catch (error) {
            console.error('Error downloading card:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            <div className="relative w-full max-w-full md:max-w-[1200px] " style={{ backgroundImage: `linear-gradient(180deg, #8B0000 0%, #AD2F16 100%)` }}>
                {/* Red gradient backdrop with temple PNG */}
                <div
                    className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col items-center"
                    style={{
                        // use imported image so build tools correctly include it
                        backgroundImage: `url(${PoojaBookingImg})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'bottom center',
                        backgroundSize: 'cover',
                        padding: '0',
                        minHeight: '80vh',
                    }}
                >

                    {/* Heading */}
                    <div className="relative z-10 w-full flex justify-between items-center px-4 md:px-8 pt-4 md:pt-6 pb-3 md:pb-4">
                        <h2 className="text-white text-lg md:text-xl font-bold">Pooja Booking Confirmation</h2>
                        <button
                            onClick={onClose}
                            className="text-white bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-all"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {/* Centered white receipt card with ticket notch */}
                    <div
                        ref={cardRef}
                        className="relative z-10 mx-auto w-full max-w-full sm:max-w-[550px] px-3 sm:px-4 md:px-6 flex flex-col items-center mt-1 md:mt-2 mb-4 md:mb-6"
                    >
                        {/* Ticket notch effect */}
                        {/* <div className="relative w-full">
                            <div className="absolute -top-2 left-0 w-5 h-5 bg-[#B22222] rounded-full" style={{ zIndex: 2 }} />
                            <div className="absolute -top-2 right-0 w-5 h-5 bg-[#B22222] rounded-full" style={{ zIndex: 2 }} />
                        </div> */}
                        <div className="bg-white rounded-2xl shadow-xl w-full overflow-visible relative" style={{ borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)' }}>
                            {/* Booking Receipt header */}
                            <div className="flex items-center justify-between px-4 md:px-5 pt-4 md:pt-5 pb-3">
                                <span className="text-sm font-bold text-gray-800">Booking Receipt</span>
                                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 md:px-3 py-1 rounded-full font-bold shadow-sm">Booking Confirmed</span>
                            </div>
                            {/* Card content */}
                            <div className="px-4 md:px-5 pb-4">
                                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-3 md:p-4 text-white shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/20 border border-white/30">
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
                                    <div className="mt-3 md:mt-4 grid grid-cols-2 gap-2 md:gap-3 text-xs">
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
                            <div className="my-3 mx-4 md:mx-5 border-t-2 border-dashed border-gray-200" />
                            {/* Details section */}
                            <div className="px-4 md:px-5 pt-2 pb-4 md:pb-5">
                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3">
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium mb-0.5">Name</div>
                                        <div className="font-bold text-gray-900 text-sm">{bookingData.userName}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 font-medium mb-0.5">Mobile Number</div>
                                        <div className="font-bold text-gray-900 text-sm">{bookingData.phoneNumber}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium mb-0.5">Booking Date</div>
                                        <div className="font-bold text-gray-900 text-sm">{bookingData.bookingDate}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 font-medium mb-0.5">Booking Time</div>
                                        <div className="font-bold text-gray-900 text-sm">{bookingData.bookingTime}</div>
                                    </div>
                                </div>
                                <div className="flex justify-center bg-white border border-gray-200 p-2 md:p-3 rounded-lg mb-3 shadow-sm">
                                    <Barcode
                                        value={bookingData.bookingId || 'NA'}
                                        height={40}
                                        width={1.5}
                                        fontSize={10}
                                        displayValue={true}
                                        margin={0}
                                    />
                                </div>
                                <p className="text-[10px] md:text-[11px] text-gray-600 text-center mb-4 px-2 md:px-3 leading-relaxed">Scan the code when you go for the puja, show this ticket to the temple officials before proceeding for the puja.</p>
                                <button
                                    data-capture-ignore
                                    onClick={handleDownload}
                                    className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-bold py-2.5 md:py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
                                >
                                    <Download size={16} className="md:w-[18px] md:h-[18px]" />
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