import React from 'react';
import aboutWorshipImage from '@/assets/images/Aboutworship.png';
import aboutworshipbgImage from '@/assets/images/aboutworshipbg.png';
import { useI18n } from '@/lib/i18n';
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
    worshipImage = aboutWorshipImage,
    onButtonClick,
    className = ""
}) => {
    const { t } = useI18n();

    // Pull translations with fallbacks
    const title = t('aboutWorship.title') || "Embark on a Journey of Spiritual Awakening at";
    const highlightedText = t('aboutWorship.highlightedText') || "Our Temple";
    const subtitle = t('aboutWorship.subtitle') || "Nurture Your Soul";
    const description = t('aboutWorship.description') || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    const buttonText = t('aboutWorship.buttonText') || "Aarti Timings";
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
        <section className={`w-full py-4 xl:py-10 px-4 md:px-16 lg:px-24  ${className} font-secondaryFont`}>

            {/* Main Container */}
            <div className="w-full  ">
                {/* Flex Container */}
                <div className="flex flex-col-reverse xl:flex-row items-center lg:items-start lg:gap-x-32 gap-y-4 justify-center gap-spacing">
                    {/* Left Content Section - Using Flex */}
                    <div className="flex-1  flex flex-col gap-6 xl:py-20">
                        {/* Title and Subtitle Container - Using Flex */}
                        <div className="flex flex-col gap-3">
                            <h1 className="font-primaryFont font-normal textHeadingLg leading-tight">
                                {title}{' '}
                                <span className="font-primaryFont inline-block bg-gradient-to-r from-secondaryColor to-red-600 text-white px-2 py-1 rounded textHeadingLg ">
                                    {highlightedText}
                                </span>
                            </h1>
                            {/* Subtitle */}
                            <h2 className="font-primaryFont font-normal textHeadingLg leading-tight ">
                                {subtitle}
                            </h2>
                        </div>
                        {/* Description Container - Using Flex */}
                        <div className="flex flex-col gap-4">
                            <p className="font-secondaryFont textDescription  text-gray-600 leading-relaxed">
                                {description}
                            </p>


                        </div>
                        {/* Render button only if handler or text exists */}
                        {onButtonClick && (
                            <button
                                type="button"
                                onClick={onButtonClick}
                                className="font-secondaryFont mt-4 w-[150px] py-1.5 bg-[#8b0000] text-white font-bold text-base leading-tight rounded-md shadow-none hover:bg-[#a32d13] transition-colors duration-200 text-center"
                                aria-label={`Learn more about ${buttonText}`}
                            >
                                {buttonText}
                            </button>
                        )}
                    </div>
                    {/* Right Image Section */}
                    <div className="flex-shrink-0 mb-4 lg:mb-0">
                        <div className="relative" ref={imageRef}>
                            {/* Natural Format Image */}
                            <div className="relative overflow-hidden rounded-lg p-3 md:p-8 min-h-[300px] sm:min-h-[415px] lg:min-h-[500px] flex items-center justify-center">
                                {/* Background image layer */}
                                <div
                                    className="absolute inset-0 z-0 pointer-events-none bg-no-repeat bg-center opacity-15"
                                    style={{
                                        backgroundImage: `url(${aboutworshipbgImage})`,
                                        // ensure it doesn't stretch; tweak size if needed
                                        // increased size so the background appears larger
                                        backgroundSize: '100% auto'
                                    }}
                                    aria-hidden="true"
                                />
                                {/* Foreground worship image */}
                                <img
                                    src={worshipImage}
                                    alt="Spiritual worship scene with hands holding flower and sacred fire"
                                    className="h-auto object-contain transition-all duration-[1200ms] ease-in-out z-10"
                                    style={{
                                        width: inView ? 'clamp(300px, 45vw, 420px)' : '80px',
                                        maxWidth: '85%',
                                    }}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutWorship;
