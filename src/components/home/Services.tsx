const services = [
    {
        image: "/temp-image-7.webp",
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: null,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: "/temp-image-6.webp",
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: null,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: "/temp-image-5.webp",
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        image: null,
        title: "Lorem ipsum dolor sit amet, consectetur",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
];

const Services = (): JSX.Element => {
    return (
        <section className="relative w-full bg-[#ece5df] py-16 px-4 md:px-8 lg:px-0 overflow-hidden">
            {/* Decorative background image for large screens */}
            <img
                className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[962px] h-auto object-contain opacity-5 pointer-events-none select-none z-0"
                alt="Decorative background"
                src="/bgcardImage.png"
                aria-hidden="true"
            />

            {/* Background images for small screens - 3 images covering 2 cards each */}
            <div className="lg:hidden absolute inset-0 z-0">
                {/* First bg image - covers cards 1-2 */}
                <img
                    className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[100%] max-w-[400px] h-[400px] object-contain opacity-10 pointer-events-none select-none"
                    alt="Decorative background 1"
                    src="/bgcardImage.png"
                    aria-hidden="true"
                />
                {/* Second bg image - covers cards 3-4 */}
                <img
                    className="absolute top-[38%] left-1/2 -translate-x-1/2 w-[100%] max-w-[400px] h-[400px] object-contain opacity-10 pointer-events-none select-none"
                    alt="Decorative background 2"
                    src="/bgcardImage.png"
                    aria-hidden="true"
                />
                {/* Third bg image - covers cards 5-6 */}
                <img
                    className="absolute top-[70%] left-1/2 -translate-x-1/2 w-[100%] max-w-[400px] h-auto object-contain opacity-10 pointer-events-none select-none"
                    alt="Decorative background 3"
                    src="/bgcardImage.png"
                    aria-hidden="true"
                />
            </div>

            <div className="relative max-w-6xl mx-auto flex flex-col items-center gap-8 z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-2 w-full">
                    <span className="text-sm md:text-base font-serif text-[#4c291e] tracking-wide">
                        Lorem Ipsum odor
                    </span>
                    <h2 className="font-marcellus text-2xl md:text-4xl text-[#4c291e] text-center font-normal">
                        Lorem ipsum dolor sit amet, consectetur
                    </h2>
                    <div className="relative flex items-center justify-center w-40 md:w-72 h-3 mt-2">
                        <img
                            className="absolute w-full h-1.5 top-1 left-0 object-cover"
                            alt="Section divider"
                            src="/line.png"
                        />
                        <div className="absolute left-1/2 -translate-x-1/2 bg-[#8b0000] w-3 h-3 rounded-full border border-solid border-[#8b0000]" />
                        <div className="absolute left-[45%] bg-[#8b0000] w-2 h-2 rounded-full border border-solid border-[#8b0000]" />
                        <div className="absolute left-[55%] bg-[#8b0000] w-2 h-2 rounded-full border border-solid border-[#8b0000]" />
                    </div>
                </div>
                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
                    {services.map((service, idx) =>
                        service.image ? (
                            <div key={idx} className="w-full h-80 bg-white rounded-lg shadow-md overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            <div key={idx} className="w-full h-80 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                                <img
                                    src="/om.png"
                                    alt="Om symbol"
                                    className="w-12 h-12 mb-4 text-[#8b0000]"
                                    loading="lazy"
                                />
                                <h3 className="font-marcellus text-lg md:text-xl text-[#4c291e] text-center mb-3 font-medium">
                                    {service.title}
                                </h3>
                                <p className="font-serif text-sm text-[#666] text-center leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default Services;