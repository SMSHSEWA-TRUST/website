import React from "react";

const BhudaanSection: React.FC = () => {
    return (
        <section className="bg-[#8B0000] py-12 px-4 md:px-0 flex flex-col items-center w-full min-h-screen relative overflow-hidden">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-5xl md:text-6xl font-bold text-[#FFE4C4] mb-2 tracking-wide drop-shadow-lg font-serif">Bhudaan</h2>
                <div className="flex items-center justify-center py-8 w-full">
                    <div className="flex items-center w-full max-w-md">
                        {/* Left arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="w-2 h-2 bg-orange-500 transform rotate-45"></div>
                            <div className="flex-1 h-px bg-orange-500"></div>
                        </div>

                        {/* Center dots with continuous line: small-small-big-small-small */}
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-px bg-orange-500"></div>
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        </div>

                        {/* Right arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="flex-1 h-px bg-orange-500"></div>
                            <div className="w-2 h-2 bg-orange-500 transform rotate-45"></div>
                        </div>
                    </div>
                </div>
                <p className="text-[#FFE4C4] text-base md:text-lg leading-relaxed mb-6 font-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-white text-lg font-semibold mb-4">
                    Donate a Portion of Land towards the Temple Construction
                </p>
                <button className="bg-white text-[#8B0000] font-bold py-2 px-6 rounded shadow hover:bg-[#FFE4C4] transition mb-8">
                    Donate Now
                </button>
            </div>
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mx-auto">
                <div className="flex items-center justify-center h-[400px] w-full overflow-hidden">
                    <img src="/bhudaan1.webp" alt="Temple 1" className="w-full h-full object-cover shadow-lg" />
                </div>
                <div className="flex flex-col h-[400px] w-full overflow-hidden gap-4">
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                        <img src="/bhudaan2.webp" alt="Temple 2" className="w-full h-full object-cover shadow-lg" />
                    </div>
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                        <img src="/bhudaan3.webp" alt="Temple 3" className="w-full h-full object-cover shadow-lg" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BhudaanSection;
