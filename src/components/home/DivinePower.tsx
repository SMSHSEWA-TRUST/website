
const DivinePower = (): JSX.Element => {
    return (
        <section className="relative w-full flex flex-col items-center justify-center mt-10">
            {/* Desktop/Large screen: text overlays image */}
            <div className="hidden md:flex relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] items-center justify-center overflow-hidden">
                {/* Background image with overlay */}
                <div
                    className="absolute inset-0 z-0"
                    aria-hidden="true"
                    style={{
                        backgroundImage:
                            "linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(180deg,rgba(0,0,0,0),rgba(139,0,0,0.75)),url('/divine-2.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="relative z-20 w-full flex flex-col items-center justify-center px-4 py-16 md:py-24">
                    <h2 className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center font-normal drop-shadow-lg max-w-3xl mx-auto">
                        Feel the Surreal Divine Power
                    </h2>
                    <p className="mt-6 sm:mt-8 max-w-xl md:max-w-2xl lg:max-w-3xl text-white text-sm sm:text-base md:text-lg text-center font-serif leading-relaxed drop-shadow">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
            </div>
            {/* Mobile/Small screen: text above image */}
            <div className="flex flex-col md:hidden w-full items-center justify-center px-4 py-10">
                <h2 className="font-marcellus text-2xl sm:text-3xl text-[#4c291e] text-center font-normal max-w-2xl mx-auto">
                    Feel the Surreal Divine Power
                </h2>
                <p className="mt-4 max-w-md text-[#4c291e] text-sm sm:text-base text-center font-serif leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <img
                    src="/divine-2.png"
                    alt="Divine temple"
                    className="w-full h-56 sm:h-72 object-cover rounded-lg mt-6 shadow"
                    loading="lazy"
                />
            </div>
        </section>
    );
};

export default DivinePower;