const About = (): JSX.Element => {
    return (
        <section className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start  ">
                {/* Left Side - Image Gallery */}
                <div className="order-2 lg:order-1">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4  ">
                        {/* Main large image - spans 2 rows */}
                        <div className="row-span-2">
                            <img
                                className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                alt="Main temple view showcasing traditional architecture"
                                src="/temp-image-4.webp"
                                loading="lazy"
                            />
                        </div>

                        {/* Top right image */}
                        <div className="row-span-1">
                            <img
                                className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                alt="Temple detail view"
                                src="/temp-image-3.webp"
                                loading="lazy"
                            />
                        </div>

                        {/* Bottom right image */}
                        <div className="row-span-1">
                            <img
                                className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                alt="Temple courtyard view"
                                src="/temp-image-2.png"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="order-2 lg:order-2 space-y-8">
                    {/* Heading */}
                    <div className="space-y-6">
                        <h2 className="font-marcellus text-[24px] sm:text-[28px] lg:text-[36px] font-normal text-[rgba(76, 41, 30, 1)] leading-tight">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        </h2>

                        {/* Decorative line */}
                        <div className="flex items-center ">
                            <div className="h-[2px] bg-orange-500 flex-1"></div>
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-[rgba(30, 30, 30, 0.5)] font-tenor-sans text-[10px]  sm:text-[12px] lg:text-[16px] font-normal leading-relaxed max-w-[500px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
                        amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                        ex ea commodo consequat.
                    </p>

                    {/* Feature List */}
                    <div className="space-y-8 pt-8">
                        <div className="flex items-start space-x-4">
                            {/* Lotus Flower Icon */}
                            <div className="flex-shrink-0 mt-1">
                                <img
                                    className="w-[50px] h-[50px] object-cover"
                                    alt="Image"
                                    src="/image 3.png"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[rgba(76, 41, 30, 1)] font-marcellus text-[10px] sm:text-[12px] lg:text-[16px] mb-2">Lorem Ipsum</h3>
                                <p className="text-[rgba(30, 30, 30, 0.5)] font-tenor-sans text-[10px] sm:text-[12px] lg:text-[12px] leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            {/* Person Icon */}
                            <div className="flex-shrink-0 mt-1">
                                <img
                                    className="w-[50px] h-[50px] object-cover"
                                    alt="Image"
                                    src="/image 2.png"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[rgba(76, 41, 30, 1)] font-marcellus text-[10px] sm:text-[12px] lg:text-[16px] mb-2">Lorem Ipsum</h3>
                                <p className="text-[rgba(30, 30, 30, 0.5)] font-tenor-sans text-[10px] sm:text-[12px] lg:text-[12px] leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;