import { Button } from "../ui/button";

const GridLayout = (): JSX.Element => {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 h-auto lg:h-[600px]">

                {/* Left Side */}
                <div className="flex flex-col gap-4 lg:gap-8">

                    {/* Content Section */}
                    <div className="bg-[#f4f0ec] p-4 sm:p-6 lg:p-12 rounded-lg lg:rounded-none flex-1 lg:min-h-[280px] flex flex-col justify-center">
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
                    <div className="grid grid-cols-2  flex-1">
                        <div className="relative overflow-hidden rounded-lg lg:rounded-none group">
                            <img
                                className="w-full h-32 sm:h-40 lg:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                alt="Temple Image 1"
                                src="/temp-image-8.png"
                            />
                        </div>
                        <div className="relative overflow-hidden rounded-lg lg:rounded-none bg-white p-2 sm:p-4 lg:p-6 flex items-center justify-center group">
                            <img
                                className="w-full h-28 sm:h-36 lg:h-full max-w-[120px] sm:max-w-[180px] lg:max-w-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                                alt="Portrait Image"
                                src="/temp-image-2.png"
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
                                src="/temp-image-11.png"
                            />
                        </div>
                        <div className="relative overflow-hidden rounded-lg lg:rounded-none group">
                            <img
                                className="w-full h-32 sm:h-40 lg:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                alt="Temple Image 2"
                                src="/temp-image-10.png"
                            />
                        </div>
                    </div>

                    {/* One Large Image Bottom */}
                    <div className="relative overflow-hidden rounded-lg lg:rounded-none flex-1 group">
                        <img
                            className="w-full h-40 sm:h-48 lg:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            alt="Large Temple Image"
                            src="/temp-image-9.png"
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};

export default GridLayout; 