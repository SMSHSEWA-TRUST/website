import { Button } from "../ui/button";

// Image imports
import tempImage8Webp from '@/assets/images/temp-image-8.webp';
import tempImage2Png from '@/assets/images/temp-image-2.png';
import tempImage11Png from '@/assets/images/temp-image-11.png';
import tempImage10Webp from '@/assets/images/temp-image-10.webp';
import tempImage9Webp from '@/assets/images/temp-image-9.webp';

const GridLayout = (): JSX.Element => {
    return (
        <section className="w-full  ">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-24 h-auto lg:h-[680px]">

                {/* Left Side */}
                <div className="flex flex-col gap-8">

                    {/* Content Section */}
                    <div className="bg-[#f4f0ec] pl-16 rounded-lg lg:rounded-none flex-1 lg:min-h-[280px] flex flex-col justify-center">
                        <div className="max-w-lg">
                            <h2 className="text-xl sm:text-2xl lg:text-4xl font-normal text-[#4c291e] font-['Marcellus',serif] leading-tight mb-3 lg:mb-6">
                                Lorem ipsum dolor sit amet, consectetur adipiscing eli
                            </h2>
                            <p className="text-sm sm:text-base lg:text-lg text-[#1e1e1e]/50 font-['Tenor_Sans',sans-serif] leading-relaxed mb-4 lg:mb-8">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <Button className="bg-[#8b0000] hover:bg-[#a32d13] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-none transition-colors duration-200">
                                <span className="font-['Tenor_Sans',sans-serif] font-normal text-xs lg:text-sm tracking-wide">
                                    CTA Button
                                </span>
                            </Button>
                        </div>
                    </div>

                    {/* Two Images Bottom - Always side by side */}
                    <div className="grid grid-cols-2 flex-1 gap-2 mb-2 p-0 m-0">
                        <div className="relative overflow-hidden rounded-lg lg:rounded-none group flex items-center justify-center h-32 sm:h-40 lg:h-full mb-2">
                            <img
                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                alt="Temple Image 1"
                                src={tempImage8Webp}
                            />
                        </div>
                        <div className="relative overflow-hidden rounded-lg lg:rounded-none bg-white p-2 sm:p-4 lg:p-6 flex items-center justify-center group h-28 sm:h-36 lg:h-full mb-2">
                            <img
                                className="w-full h-full max-w-[120px] sm:max-w-[180px] lg:max-w-[250px] object-contain transition-transform duration-300 group-hover:scale-105"
                                alt="Portrait Image"
                                src={tempImage2Png}
                            />
                        </div>
                    </div>

                </div>

                {/* Right Side */}
                <div className="flex flex-col ">

                    {/* Two Images Top - Always side by side */}
                    <div className="grid grid-cols-2 flex-1">
                        <div className="relative overflow-hidden rounded-lg lg:rounded-none bg-[#8b0000] p-2 sm:p-4 lg:p-6 flex items-center justify-center group">
                            <img
                                className="w-full h-28 sm:h-36 lg:h-full max-w-[120px] sm:max-w-[180px] lg:max-w-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                                alt="Portrait Image 2"
                                src={tempImage11Png}
                            />
                        </div>
                        <div className="relative overflow-hidden rounded-lg lg:rounded-none group">
                            <img
                                className="w-full h-32 sm:h-40 lg:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                alt="Temple Image 2"
                                src={tempImage10Webp}
                            />
                        </div>
                    </div>

                    {/* One Large Image Bottom */}
                    <div className="relative overflow-hidden rounded-lg lg:rounded-none flex-1 group lg:mb-4">
                        <img
                            className="w-full h-40 sm:h-48 lg:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            alt="Large Temple Image"
                            src={tempImage9Webp}
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};

export default GridLayout;