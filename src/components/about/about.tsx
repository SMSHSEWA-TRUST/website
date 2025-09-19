import React from "react";
import AboutImg from "../../assets/images/About.webp";

const About: React.FC = () => {
    return (
        <section className="w-full py-12 px-4 md:px-16 lg:px-24 ">
            <div className="  grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: actual image */}
                <div className="md:col-span-6">
                    <div className="w-full h-72 md:h-[420px] lg:h-[480px] rounded-lg overflow-hidden shadow-sm">
                        <img src={AboutImg} alt="About" className="object-cover w-full h-full" />
                    </div>
                </div>

                {/* Right: heading + decorative line + text */}
                <div className="md:col-span-6 flex flex-col justify-start">
                    <div className="">
                        <div className="flex items-center">
                            <h2 className="text-3xl md:text-4xl font-primaryFont text-[#4C291E] tracking-wide">About Us</h2>

                           
                        </div>

                        {/* Decorative line */}
                        <div className="flex items-center ">
                            <div className="h-[2px] bg-secondaryColor flex-1"></div>
                            <div className="w-3 h-3 bg-secondaryColor rounded-full"></div>
                            <div className="w-2 h-2 bg-secondaryColor rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-secondaryColor rounded-full"></div>
                        </div>

                        <p className="mt-6 textDescription text-gray-600 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua.
                        </p>

                        <p className="mt-4 textDescription text-gray-600 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
