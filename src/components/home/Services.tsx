
import tempImage7Webp from '@/assets/images/temp-image-7.webp';
import tempImage6Webp from '@/assets/images/temp-image-6.webp';
import tempImage5Webp from '@/assets/images/temp-image-5.webp';
import bgcardImagePng from '@/assets/images/bgcardImage.png';
import linePng from '@/assets/images/line.png';
import omPng from '@/assets/images/om.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const services = [
    {
        image: tempImage7Webp,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: null,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: tempImage6Webp,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: null,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: tempImage5Webp,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: null,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
];

const Services = (): JSX.Element => {
    return (
        <section className="relative w-full bg-[#ece5df] py-16 px-4 md:px-8 lg:px-0 overflow-hidden">
            {/* Decorative background image for large screens */}
            <LazyLoadImage
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[962px] h-auto object-contain opacity-5 pointer-events-none select-none z-0"
                alt="Decorative background"
                src={bgcardImagePng}
                aria-hidden="true"
                loading="lazy"
            />
            <div className="relative max-w-6xl mx-auto flex flex-col items-center gap-8 z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-2 w-full">
                    <span className="text-sm md:text-base font-serif text-[#4c291e] tracking-wide">
                        Lorem Ipsum odor
                    </span>
                    <h2 className="font-marcellus text-2xl md:text-4xl text-[#4c291e] text-center font-normal">
                        Lorem ipsum dolor sit amet, consectetur
                    </h2>
                    <div className="flex items-center justify-center py-8 w-full">
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
                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8 relative">
                    {/* Background images for small screens - each covers 2 cards */}
                    <div className="absolute inset-0 lg:hidden">
                        {/* First background image for cards 1-2 */}
                        <LazyLoadImage
                            className="absolute top-0 left-0 w-full h-[calc(50%+12px)] object-cover opacity-10 pointer-events-none"
                            alt="Background 1"
                            src={tempImage7Webp}
                            loading="lazy"
                        />
                        {/* Second background image for cards 3-4 */}
                        <LazyLoadImage
                            className="absolute top-[calc(50%+12px)] left-0 w-full h-[calc(50%+12px)] object-cover opacity-10 pointer-events-none"
                            alt="Background 2"
                            src={tempImage6Webp}
                            loading="lazy"
                        />
                        {/* Third background image for cards 5-6 */}
                        <LazyLoadImage
                            className="absolute top-[calc(100%+24px)] left-0 w-full h-[calc(50%+12px)] object-cover opacity-10 pointer-events-none"
                            alt="Background 3"
                            src={tempImage5Webp}
                            loading="lazy"
                        />
                    </div>

                    {services.map((service, idx) =>
                        service.image ? (
                            <div key={idx} className="w-full h-80 bg-white rounded-lg shadow-md overflow-hidden relative z-10">
                                <LazyLoadImage
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            <div key={idx} className="w-full h-80 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center relative z-10">
                                <LazyLoadImage
                                    src={omPng}
                                    alt="Om symbol"
                                    className="w-12 h-12 mb-4 text-[#8b0000]"
                                    loading="lazy"
                                />
                                <h3 className="font-marcellus text-lg md:text-xl text-[#4c291e] text-center mb-3 font-medium">
                                    {service.title}
                                </h3>
                                <p className="font-serif text-sm text-[#666] text-center leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default Services;