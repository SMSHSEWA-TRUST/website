import { LazyLoadImage } from 'react-lazy-load-image-component';
import pujaImageWebp from '@/assets/images/pujaImage.webp';

const pujaData = [
    {
        title: "Puja 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        image: pujaImageWebp,
        cta: "CTA Button"
    },
    {
        title: "Puja 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        image: pujaImageWebp,
        cta: "CTA Button"
    },
    {
        title: "Puja 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        image: pujaImageWebp,
        cta: "CTA Button"
    },
    {
        title: "Puja 4",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        image: pujaImageWebp,
        cta: "CTA Button"
    },
];

export default function Puja() {
    return (
        <div className="px-4 md:px-16 lg:px-24  ">

            <div className='flex flex-col gap-7 mt-10'>
                <div> <h2 className="font-primaryFont textHeadingLg text-[#8B0000] text-center mb-2">Puja's at Temple</h2>

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
                    {pujaData.map((puja, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-lg p-1"
                          
                        >
                            <div className="bg-white rounded-lg overflow-hidden">
                                {/* Image Section */}
                                <div className="relative w-full overflow-hidden">
                                    <LazyLoadImage
                                        src={puja.image}
                                        alt={puja.title}
                                        className="w-full h-full object-contain rounded-lg"
                                        loading="lazy"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(30, 0, 0, 0.22) 50%, rgba(0, 0, 0, 1) 100%)',
                                        }}
                                    />
                                </div>

                                {/* Content Section */}
                                <div className='pt-4'>
                                    {/* Title */}
                                    <h2 className="textHeading font-bold text-[#8B0000] mb-4 font-primaryFont">
                                        {puja.title}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-gray-700 textDescription leading-relaxed mb-6 font-secondaryFont">
                                        {puja.description}
                                    </p>

                                    {/* CTA Button */}
                                    <button className="bg-[#8B0000] hover:bg-[#6B1028] text-white px-6 py-1 font-semibold textDescription transition-colors duration-200 shadow-sm hover:shadow-md font-secondaryFont rounded-lg">
                                        {puja.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
