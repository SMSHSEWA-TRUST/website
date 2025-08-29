import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface HeroSectionProps {
    title?: string;
    description?: string;
    backgroundImage?: string;
    className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title = "Title",
    description = "",
    backgroundImage = "",
    className = ""
}) => {
    return (
        <section
            className={`w-full ${className} `}
            role="banner"
            aria-labelledby="hero-section-title"
        >
            {/* Responsive Image Section */}
            {backgroundImage && (
                <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[50vh] lg:h-[60vh] xl:h-[60vh] overflow-hidden">
                    <LazyLoadImage
                        src={backgroundImage}
                        alt={title}
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                        decoding="async"
                    />
                    {/* Title overlaid on image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/30" />
                        <h1
                            id="hero-section-title"
                            className="font-primaryFont relative z-10 font-normal text-[32px] lg:text-[64px] text-white text-center drop-shadow-lg"
                        >
                            {title}
                        </h1>
                    </div>
                </div>
            )}
          
            {/* Text Content Section Below Image */}
            {description && description.trim() !== "" && (
                <div className="w-full bg-white ">
                    <div className=" pt-9 px-4 md:px-16 lg:px-24   ">

                        <p className="font-secondaryFont font-normal textDescription text-[rgba(0, 0, 0, 0.5)] leading-relaxed text-center">
                            {description}
                        </p>

                    </div>
                </div>
            )}
        </section>
    );
};

export default HeroSection;
