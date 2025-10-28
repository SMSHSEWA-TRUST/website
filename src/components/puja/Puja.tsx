import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PujaBookingModal from './PujaBookingModal';
import { useGetPooja } from '@/api/PoojaQueries';
import { PoojaItem } from '@/services/pooja.service';

export default function Puja() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPooja, setSelectedPooja] = useState<PoojaItem | null>(null);

    // Fetch pooja data from API
    const { data: poojaResponse, isLoading, isError } = useGetPooja();

    const handleBookNow = (pooja: PoojaItem) => {
        setSelectedPooja(pooja);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="px-4 md:px-16 lg:px-24 flex items-center justify-center min-h-[400px]">
                <p className="text-[#8B0000] textHeading">Loading poojas...</p>
            </div>
        );
    }

    if (isError || !poojaResponse?.success) {
        return (
            <div className="px-4 md:px-16 lg:px-24 flex items-center justify-center min-h-[400px]">
                <p className="text-red-600 textHeading">Failed to load poojas. Please try again later.</p>
            </div>
        );
    }

    const poojaData = poojaResponse?.data?.filter((pooja) => pooja.isActive) || [];

    return (
        <div className="px-4 md:px-16 lg:px-24  ">

            <div className='flex flex-col gap-7 mt-10'>
                <div> <h2 className="font-primaryFont textHeadingLg text-[#8B0000] text-center mb-2">Pooja's at Temple</h2>

                    <div className="flex items-center justify-center  w-full">
                        <div className="flex items-center w-full max-w-md">
                            {/* Left arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="w-2 h-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', transform: 'rotate(45deg)' }}></div>
                                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            </div>

                            {/* Center dots with continuous line: small-small-big-small-small */}
                            <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            </div>

                            {/* Right arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-2 h-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', transform: 'rotate(45deg)' }}></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Grid Layout - 2x2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-4">
                    {poojaData.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-600 textHeading">No poojas available at the moment.</p>
                        </div>
                    ) : (
                        poojaData.map((puja: PoojaItem, index: number) => (
                            <div
                                key={puja._id || index}
                                className="overflow-hidden rounded-lg p-1 h-full"
                            >
                                <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
                                    {/* Image Section */}
                                    <div className="relative w-full overflow-hidden h-64 flex-shrink-0">
                                        <LazyLoadImage
                                            src={puja.imageUrl || ''}
                                            alt={puja.title}
                                            className="w-full h-full object-cover rounded-lg"
                                            loading="lazy"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(30, 0, 0, 0.22) 50%, rgba(0, 0, 0, 1) 100%)',
                                            }}
                                        />
                                    </div>

                                    {/* Content Section */}
                                    <div className='pt-4 flex flex-col flex-grow'>
                                        {/* Title */}
                                        <h2 className="textHeading font-bold text-[#8B0000] mb-4 font-primaryFont min-h-[2.5rem]">
                                            {puja.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-gray-700 textDescription leading-relaxed mb-6 font-secondaryFont flex-grow">
                                            {puja.description}
                                        </p>

                                        {/* Price and Button Container */}
                                        <div className="mt-auto">
                                            {/* Price */}
                                            <p className="text-[#8B0000] font-semibold textDescription mb-4 font-secondaryFont">
                                                Price: ₹{puja.price}
                                            </p>

                                            {/* CTA Button */}
                                            <button
                                                onClick={() => handleBookNow(puja)}
                                                className="bg-[#8B0000] hover:bg-[#6B1028] text-white px-6 py-1 font-semibold textDescription transition-colors duration-200 shadow-sm hover:shadow-md font-secondaryFont rounded-lg"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pooja Booking Modal */}
            <PujaBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPooja={selectedPooja}
            />
        </div>
    );
}
