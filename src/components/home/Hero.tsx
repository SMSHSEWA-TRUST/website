import { useState, useEffect } from 'react';
import { Button } from "../ui/button";

const Hero = (): JSX.Element => {
    const [textIndex, setTextIndex] = useState(0);
    const texts = [
        'JAI SHRI MAHAKAL',
        'JAI SHRI SALASAR BALAJI',
        // Add more text items as needed
    ];

    // Array of deity images that will change with the text - using different actual images
    const deityImages = [
        '/deity.png',        // For JAI SHRI MAHAKAL
        '/balaji.png',       // For JAI SHRI SALASAR BALAJI
        // Add more image paths as needed
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <section className="w-full mt-4 lg:mt-[31px]">
            {/* Desktop Layout - Responsive Design */}
            <div className="hidden lg:block relative w-full max-w-[1400px] mx-auto">
                <div className="relative w-full" style={{ aspectRatio: '1283/741' }}>
                    {/* Red section - responsive width with no gap */}
                    <div className="absolute w-[34%] h-full top-0 right-0 bg-[#8b0000]">
                        {/* Abstract floral - only in right red section */}
                        <img
                            className="absolute right-0 top-0 w-full h-full object-cover opacity-60 pointer-events-none"
                            alt="Abstract floral"
                            src="/abstract-floral.png"
                        />
                    </div>

                    {/* Temple image - responsive with slight overlap to prevent gap */}
                    <img
                        className="absolute w-[67%] h-full top-0 left-0 object-cover"
                        alt="Temple Image"
                        src="/temp-image.png"
                    />

                    {/* Desktop Deity Images - responsive positioning and scaling */}
                    <div className="absolute w-[40.6%] h-[70.2%] top-[12.8%] right-[6.5%] overflow-hidden">
                        {deityImages.map((imageSrc, index) => (
                            <img
                                key={index}
                                className={`absolute w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${index === textIndex
                                    ? 'opacity-100 scale-100'
                                    : 'opacity-0 scale-105'
                                    }`}
                                alt={`Deity Image ${index + 1}`}
                                src={imageSrc}
                                style={{
                                    filter: index === textIndex ? 'brightness(1)' : 'brightness(0.8)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Text content - responsive positioning */}
                    <div className="absolute w-[34.4%] h-[39%] top-[35.4%] left-[5.8%]">
                        <div className="relative w-full h-full">
                            <div className="absolute w-full top-0 left-0 font-tenor-sans text-[16px] text-white tracking-[0] leading-[normal]">
                                Feel Lord Shiva&apos;s Power
                                <div className="relative w-full h-full">
                                    <div
                                        className="absolute w-[110.6%] top-[26px] left-0 [-webkit-text-stroke:2px_#daa520] font-marcellus font-normal text-white text-[64px] tracking-[0] leading-[normal] animate-slideUpText"
                                        key={texts[textIndex]}
                                    >
                                        {texts[textIndex]}
                                    </div>
                                </div>
                            </div>

                            <p className="absolute w-full top-[68.5%] left-0 font-tenor-sans text-[16px] text-[rgba(255,255,255,0.9)] leading-[normal] font-normal tracking-[0]">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>

                        {/* Responsive button */}
                        <Button className="flex justify-center gap-[6.98px] px-4 xl:px-6 2xl:px-8 py-2 xl:py-3 2xl:py-4 mt-4 xl:mt-6 2xl:mt-8 bg-[#daa520] items-center rounded-none hover:bg-[#b8941c] transition-colors">
                            <span className="relative [-webkit-text-stroke:0.5px_#ffffff] font-tenor-sans font-normal text-white text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">
                                Register/Login
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Layout - Matching your design image */}
            <div className="lg:hidden w-full">
                {/* Top Section - Temple background with text overlay */}
                <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden">
                    {/* Background temple image */}
                    <img
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Temple Image"
                        src="/temp-image.png"
                    />

                    {/* Text overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-center items-start px-6 sm:px-8">
                        <div className="w-full max-w-sm">
                            <p className="text-white text-[7px] font-tenor-sans font-normal mb-2 sm:mb-3">
                                Feel Lord Shiva&apos;s Power
                            </p>

                            <div
                                className="[-webkit-text-stroke:1px_#daa520] font-marcellus text-[31px] font-normal text-white   leading-tight mb-4 sm:mb-6 animate-slideUpText"
                                key={texts[textIndex]}
                            >
                                {texts[textIndex]}
                            </div>

                            <p className="text-white text-[7px] font-tenor-sans font-normal leading-relaxed mb-6 sm:mb-8 opacity-90">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation.
                            </p>

                            <Button className="bg-[#daa520] hover:bg-[#b8941c] text-white px-6 py-2.5 sm:px-8 sm:py-3 text-[7px] font-tenor-sans font-normal rounded-none shadow-lg">
                                Register/Login
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Red background with abstract floral and deity image */}
                <div className="relative w-full bg-[#8b0000] py-8 sm:py-12 md:py-16 flex justify-center items-center overflow-hidden">
                    {/* Abstract floral background - positioned to cover most of the red section */}
                    <img
                        className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
                        alt="Abstract floral"
                        src="/abstract-floral.png"
                    />

                    {/* Additional abstract floral positioning for better coverage */}
                    <img
                        className="absolute top-[-20px] left-[-20px] w-[120%] h-[120%] object-cover opacity-20"
                        alt="Abstract floral overlay"
                        src="/abstract-floral.png"
                    />

                    {/* Deity image container - positioned above the abstract floral */}
                    <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
                        {/* Golden circular frame background */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#daa520] to-[#b8941c] p-1 shadow-2xl">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                {/* Deity Images with smooth transitions */}
                                {deityImages.map((imageSrc, index) => (
                                    <img
                                        key={index}
                                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${index === textIndex
                                            ? 'opacity-100 scale-100'
                                            : 'opacity-0 scale-105'
                                            }`}
                                        alt={`Deity Image ${index + 1}`}
                                        src={imageSrc}
                                        style={{
                                            filter: index === textIndex ? 'brightness(1)' : 'brightness(0.8)',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Decorative glow effect */}
                        <div className="absolute inset-0 rounded-full bg-[#daa520] opacity-20 blur-xl scale-110"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero; 