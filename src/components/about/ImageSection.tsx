import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useI18n } from '@/lib/i18n';
import aboutSection1 from "@/assets/images/aboutSection1.png";
import aboutSection2 from "@/assets/images/aboutSection2.webp";
import aboutSection3 from "@/assets/images/aboutSection3.png";

const images = [
    aboutSection1, // left card image
    aboutSection2, // middle card image
    aboutSection3, // right card image
];

// default card data used as fallback when translations are absent
const defaultCardData = [
    {
        bg: "" /* will use inline style for rgba(139,0,0,1) */,
        text: "text-white",
        title: "Lorem Ipsum",
        desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: images[0],
        alt: 'Worship scene left'
    },
    {
        bg: "" /* no bg, no shadow, no radius for center card */,
        text: "text-gray-900",
        title: "",
        desc: "",
        image: images[1],
        alt: 'Worship scene center'
    },
    {
        bg: "bg-[#f9f6f2]",
        text: "text-gray-900",
        title: "Lorem Ipsum",
        desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: images[2],
        alt: 'Worship scene right'
    },
];

const ImageSection: React.FC = () => {
    const { t } = useI18n();

    // load translations for the image section; fallback to defaults
    const translatedCards: Array<any> = t('aboutImagesectioncontent.cards') || defaultCardData.map(c => ({
        title: c.title,
        desc: c.desc,
        alt: c.alt
    }));

    return (
        <section className="w-full py-8 px-4 md:px-16 lg:px-24 font-secondaryFont bg-[#F8F5F0] ">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {defaultCardData.map((card, idx) => {
                    // merge translated values with defaults
                    const trans = translatedCards[idx] || {};
                    const title = trans.title !== undefined ? trans.title : card.title;
                    const desc = trans.desc !== undefined ? trans.desc : card.desc;
                    const alt = trans.alt !== undefined ? trans.alt : card.alt;
                    // First card: custom background
                    if (idx === 0) {
                        return (
                            <div
                                key={idx}
                                className={`flex flex-col items-center justify-start overflow-hidden p-6 md:p-8 md:h-[598px] `}
                                style={{ background: "rgba(139,0,0,1)" }}
                            >
                                <div className="w-full flex justify-center">
                                    <div
                                        className="w-[320px] h-[370px] flex items-center justify-center bg-transparent"
                                    >
                                        <LazyLoadImage
                                            src={card.image}
                                            alt={alt || card.title || "Worship scene"}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                </div>
                                {card.title && (
                                    <h3 className={`font-primaryFont mt-6 mb-2 textHeading font-semibold text-center text-[white]`}>
                                        {title}
                                    </h3>
                                )}
                                {desc && (
                                    <p className={`font-secondaryFont textDescription  text-center text-[white] opacity-80 mb-2`}>{desc}</p>
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

                                <div className="w-full h-auto md:h-full overflow-hidden">
                                    <LazyLoadImage
                                        src={card.image}
                                        alt={alt || card.title || 'Worship scene'}
                                        className="w-full h-auto md:h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            </div>
                        );
                    }
                    // Third card: default bg, shadow, radius
                    return (
                        <div
                            key={idx}
                            className={`flex flex-col items-center justify-start rounded-xl  overflow-hidden ${card.bg} p-6 md:p-8 md:h-[598px] rounded-md`}
                            style={{ background: "rgba(139,0,0,1)" }}
                        >
                            <div className="w-full flex justify-center">
                                <div
                                    className="w-[320px] h-[370px] flex items-center justify-center bg-transparent"
                                >
                                    <LazyLoadImage
                                        src={card.image}
                                        alt={alt || card.title || "Worship scene"}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            </div>
                            {title && (
                                <h3 className={`font-primaryFont text-[white] mt-6 mb-2 textHeading font-semibold text-center `}>
                                    {title}
                                </h3>
                            )}
                            {desc && (
                                <p className={`font-secondaryFont text-[white] textDescription text-center  opacity-80 mb-2`}>{desc}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ImageSection;
