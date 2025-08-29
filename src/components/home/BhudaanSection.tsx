import React from "react";
import bhudaan1 from '@/assets/images/bhudaan1.webp';
import bhudaan2 from '@/assets/images/bhudaan2.webp';
import bhudaan3 from '@/assets/images/bhudaan3.webp';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const BhudaanSection: React.FC = () => {
    return (
        <section className="bg-[#8B0000] py-6  flex flex-col items-center w-full relative overflow-hidden px-4 md:px-16 lg:px-24">
            <div className=" text-center">
                <h2
                    className="text-5xl md:text-6xl font-bold font-primaryFont"
                    style={{
                        color: '#fff',
                        WebkitTextStroke: '2px #d05e2d',
                        textShadow: '0px 2px 4px rgba(139,0,0,0.5), 0px 0.5px 0px #fff',
                        letterSpacing: '0.04em',
                    }}
                >
                    Bhumi Daan
                </h2>
                <div className="flex items-center justify-center py-2 w-full">
                    <div className="flex items-center w-full max-w-md">
                        {/* Left arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="w-2 h-2 bg-secondaryColor transform rotate-45"></div>
                            <div className="flex-1 h-px bg-secondaryColor"></div>
                        </div>

                        {/* Center dots with continuous line: small-small-big-small-small */}
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                            <div className="w-3 h-px bg-secondaryColor"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                            <div className="w-3 h-px bg-secondaryColor"></div>
                            <div className="w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                            <div className="w-3 h-px bg-secondaryColor"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                            <div className="w-3 h-px bg-secondaryColor"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                        </div>

                        {/* Right arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="flex-1 h-px bg-secondaryColor"></div>
                            <div className="w-2 h-2 bg-secondaryColor transform rotate-45"></div>
                        </div>
                    </div>
                </div>
                <p className="text-[#FFE4C4] textDescription leading-relaxed mb-2 font-light font-secondaryFont">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-white textHeading font-semibold mb-4 font-primaryFont">
                    Donate a Portion of Land towards the Temple Construction
                </p>
                <button className="bg-white text-[#8B0000] textDescription font-bold py-2 px-6 rounded shadow hover:bg-[#FFE4C4] transition font-secondaryFont">
                    Donate Now
                </button>
            </div>
            <div className=" w-full grid grid-cols-2 gap-1 lg:gap-6 mt-8 ">
                <div className="flex items-center justify-center h-[180px] sm:h-[220px] md:h-[300px] lg:h-[451px] w-full overflow-hidden">
                    <LazyLoadImage
                        src={bhudaan1}
                        alt="Temple 1"
                        className="w-full h-full object-cover shadow-lg rounded-md"
                        loading="lazy"
                    />
                </div>
                <div className="flex flex-col h-[180px] sm:h-[220px] md:h-[300px] lg:h-[451px] w-full overflow-hidden gap-4">
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                        <LazyLoadImage
                            src={bhudaan2}
                            alt="Temple 2"
                            className="w-full h-full object-cover shadow-lg rounded-md"
                            loading="lazy"
                        />
                    </div>
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                        <LazyLoadImage
                            src={bhudaan3}
                            alt="Temple 3"
                            className="w-full h-full object-cover shadow-lg rounded-md"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BhudaanSection;
