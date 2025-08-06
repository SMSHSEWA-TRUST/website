import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import aboutSection1 from "@/assets/images/aboutSection1.png";
import aboutSection2 from "@/assets/images/aboutSection2.webp";
import aboutSection3 from "@/assets/images/aboutSection3.png";

const images = [
    aboutSection1, // left card image
    aboutSection2, // middle card image
    aboutSection3, // right card image
];

const cardData = [
    {
        bg: "" /* will use inline style for rgba(139,0,0,1) */,
        text: "text-white",
        title: "Lorem Ipsum",
        desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: images[0],
    },
    {
        bg: "" /* no bg, no shadow, no radius for center card */,
        text: "text-gray-900",
        title: "",
        desc: "",
        image: images[1],
    },
    {
        bg: "bg-[#f9f6f2]",
        text: "text-gray-900",
        title: "Lorem Ipsum",
        desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: images[2],
    },
];

const ImageSection: React.FC = () => {
    return (
        <section className="w-full py-8 px-2 sm:px-6 lg:px-[80px] ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {cardData.map((card, idx) => {
                    // First card: custom background
                    if (idx === 0) {
                        return (
                            <div
                                key={idx}
                                className={`flex flex-col items-center justify-start overflow-hidden p-6 md:p-8 md:h-[598px]`}
                                style={{ background: "rgba(139,0,0,1)" }}
                            >
                                <div className="w-full flex justify-center">
                                    <div
                                        className="w-[220px]  flex items-center justify-center bg-transparent"

                                    >
                                        <LazyLoadImage
                                            src={card.image}
                                            alt={card.title || "Worship scene"}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                </div>
                                {card.title && (
                                    <h3 className={`mt-6 mb-2 text-2xl font-serif font-semibold text-center ${card.text}`}>
                                        {card.title}
                                    </h3>
                                )}
                                {card.desc && (
                                    <p className={`text-base text-center ${card.text} opacity-80 mb-2`}>{card.desc}</p>
                                )}
                               
                            </div>
                        );
                    }
                    // Center card: no bg, no shadow, no radius, image fills card
                    if (idx === 1) {
                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-center w-full md:h-[598px]"
                                style={{ background: "transparent" }}
                            >
                                <LazyLoadImage
                                    src={card.image}
                                    alt="Worship scene"
                                    className="w-full h-auto md:h-full object-cover"
                                    style={{ borderRadius: 0, boxShadow: "none" }}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        );
                    }
                    // Third card: default bg, shadow, radius
                    return (
                        <div
                            key={idx}
                            className={`flex flex-col items-center justify-start rounded-xl  overflow-hidden ${card.bg} p-6 md:p-8 md:h-[598px]`}
                        >
                            <div className="w-full flex justify-center">
                                <div
                                    className="w-[220px] h-[260px] flex items-center justify-center bg-transparent"

                                >
                                    <LazyLoadImage
                                        src={card.image}
                                        alt={card.title || "Worship scene"}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            </div>
                            {card.title && (
                                <h3 className={`mt-6 mb-2 text-2xl font-serif font-semibold text-center ${card.text}`}>
                                    {card.title}
                                </h3>
                            )}
                            {card.desc && (
                                <p className={`text-base text-center ${card.text} opacity-80 mb-2`}>{card.desc}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ImageSection;
