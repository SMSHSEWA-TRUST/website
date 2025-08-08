import React from 'react';
import aboutWorshipImage from '@/assets/images/Aboutworship.webp';
import aboutworshipbgImage from '@/assets/images/aboutworshipbg.png';
interface AboutWorshipProps {
    title?: string;
    highlightedText?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    worshipImage?: string;
    onButtonClick?: () => void;
    className?: string;
}

const AboutWorship: React.FC<AboutWorshipProps> = ({
    title = "Embark on a Journey of Spiritual Awakening at",
    highlightedText = "Our Temple",
    subtitle = "Nurture Your Soul",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    buttonText = "Aarti Timings",
    worshipImage = aboutWorshipImage,
    onButtonClick = () => { },
    className = ""
}) => {
    // Animation for image width on scroll into view
    const [inView, setInView] = React.useState(false);
    const imageRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (imageRef.current) {
            observer.observe(imageRef.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <section className={`w-full py-8 sm:py-12 lg:py-16 bg-gray-50 ${className}`}>
            <div className="w-full mx-auto px-2 sm:px-4 lg:px-6">
                {/* Main Container */}
                <div className="w-full p-4 sm:p-6 lg:p-8 bg-white">
                    {/* Flex Container */}
                    <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-x-32  justify-center gap-y-6 md:gap-y-8">
                        {/* Left Content Section - Using Flex */}
                        <div className="flex-1  max-w-[700px] flex flex-col gap-6">
                            {/* Title and Subtitle Container - Using Flex */}
                            <div className="flex flex-col gap-3">
                                <h1 className="font-marcellus font-normal lg:text-[36px] text-[24px] leading-tight">
                                    {title}{' '}
                                    <span className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-1 rounded text-lg sm:text-xl lg:text-2xl xl:text-3xl">
                                        {highlightedText}
                                    </span>
                                </h1>
                                {/* Subtitle */}
                                <h2 className="font-marcellus font-normal lg:text-[36px] text-[24px] leading-tight 
                            ">
                                    {subtitle}
                                </h2>
                            </div>
                            {/* Description Container - Using Flex */}
                            <div className="flex flex-col gap-4">
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {description}
                                </p>


                            </div>
                            <button
                                type="button"
                                onClick={onButtonClick}
                                className="mt-4 w-[150px] py-1.5 bg-[#8b0000] text-white font-bold text-base leading-tight rounded-md shadow-none hover:bg-[#a32d13] transition-colors duration-200 text-center"
                                aria-label={`Learn more about ${buttonText}`}
                            >
                                {buttonText}
                            </button>
                        </div>
                        {/* Right Image Section */}
                        <div className="flex-shrink-0 mb-6 lg:mb-0">
                            <div className="relative" ref={imageRef}>
                                {/* Natural Format Image */}
                                <div className="overflow-hidden rounded-lg  relative">
                                    {/* Background image */}
                                    <img
                                        src={aboutworshipbgImage}
                                        alt="Decorative worship background"
                                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-2000 "
                                        aria-hidden="true"
                                        draggable="false"
                                    />
                                    {/* Foreground worship image */}
                                    <img
                                        src={worshipImage}
                                        alt="Spiritual worship scene with hands holding flower and sacred fire"
                                        className="relative h-auto object-cover transition-all duration-[1200ms] ease-in-out z-10"
                                        style={{
                                            width: inView ? 'clamp(300px, 45vw, 420px)' : '80px',
                                            maxWidth: '100%',
                                            height: 'auto',
                                            margin: '0 auto',
                                            display: 'block',
                                            position: 'relative',
                                            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)'
                                        }}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                {/* Subtle shadow effect */}
                                <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutWorship;
