import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import aboutImage from '@/assets/images/About.webp';

interface AboutHeroProps {
    title?: string;
    description?: string;
    backgroundImage?: string;
    className?: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({
    title = "About",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    backgroundImage = aboutImage,
    className = ""
}) => {
    return (
        <section
            className={`w-full ${className}`}
            role="banner"
            aria-labelledby="about-hero-title"
        >
            {/* Responsive Image Section */}
            <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh] overflow-hidden">
                <LazyLoadImage
                    src={backgroundImage}
                    alt="Sacred architectural arches with golden sunset"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                    decoding="async"
                />

                {/* Title overlaid on image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" />
                    <h1
                        id="about-hero-title"
                        className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white text-center"
                    >
                        {title}
                    </h1>
                </div>
            </div>

            {/* Text Content Section Below Image */}
            <div className="w-full bg-white ">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gray-50 rounded-lg p-6 sm:p-8 lg:p-10">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-justify">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
