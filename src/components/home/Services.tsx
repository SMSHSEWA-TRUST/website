import { Card, CardContent } from "../ui/card";

const services = [
    {
        image: "/temp-image-7.png",
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
        image: "/temp-image-6.png",
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
        image: "/temp-image-5.png",
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
                className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] max-w-4xl h-full object-cover opacity-20 pointer-events-none select-none"
                alt="Decorative background"
                src="/mand-7.png"
                aria-hidden="true"
            />
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
                            <div key={idx} className="flex flex-col items-center">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-64 object-cover rounded-md shadow-md mb-4"
                                    loading="lazy"
                                />
                                <Card className="w-full bg-white rounded-lg shadow p-6 flex flex-col items-center">
                                    <CardContent className="p-0 flex flex-col items-center">
                                        <img
                                            src="/om.png"
                                            alt="Om symbol"
                                            className="w-10 h-10 mb-4"
                                            loading="lazy"
                                        />
                                        <h3 className="font-marcellus text-lg md:text-xl text-[#4c291e] text-center mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="font-serif text-xs text-[#1e1e1e80] text-center">
                                            {service.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card
                                key={idx}
                                className="w-full bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center"
                            >
                                <CardContent className="p-0 flex flex-col items-center">
                                    <img
                                        src="/om.png"
                                        alt="Om symbol"
                                        className="w-10 h-10 mb-4"
                                        loading="lazy"
                                    />
                                    <h3 className="font-marcellus text-lg md:text-xl text-[#4c291e] text-center mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="font-serif text-xs text-[#1e1e1e80] text-center">
                                        {service.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default Services;