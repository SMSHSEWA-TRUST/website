
import MahaKaleshwarImage from '@/assets/images/temp-image-7-small.webp';
import BalaJiImage from '@/assets/images/temp-image-6-small.webp';
import TempleImage from '@/assets/images/temp-image-5.webp';
import bgcardImagePng from '@/assets/images/bgcardImage.png';
import omPng from '@/assets/images/om.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useI18n } from '@/lib/i18n';

// Images are kept in code; titles/descriptions are localized via i18n
const images = [
    MahaKaleshwarImage,
    null,
    BalaJiImage,
    null,
    TempleImage,
    null,
];

const Services = (): JSX.Element => {
    const { t } = useI18n();

    const defaultItems = [
        { title: 'Lorem ipsum dolor sit amet, consectetur', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { title: 'Lorem ipsum dolor sit amet, consectetur', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { title: 'Lorem ipsum dolor sit amet, consectetur', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { title: 'Lorem ipsum dolor sit amet, consectetur', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { title: 'Lorem ipsum dolor sit amet, consectetur', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { title: 'Lorem ipsum dolor sit amet, consectetur', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    ];

    const localizedItems = (t('services.items') as any[]) || defaultItems;

    // Provide explicit order classes so we can swap specific cards at the md breakpoint.
    // Tailwind needs literal class names to keep them in the build, so return the
    // exact strings instead of constructing them dynamically.
    const getOrderClass = (idx: number) => {
        switch (idx) {
            case 0:
                return 'order-1 ';
            case 1:
                return 'order-2 lg:order-4 ';
            case 2:
                return ' order-5 lg:order-3 ';
            case 3:
                return 'order-4 lg:order-2';
            case 4:
                return 'order-3 lg:order-5 ';
            case 5:
                return 'order-6 ';
            default:
                return `order-${idx + 1}`;
        }
    };

    return (
        <section className="relative w-full bg-[#ece5df] py-16 px-4 md:px-16 lg:px-24 overflow-hidden">
            {/* Decorative background image for large screens */}
            <LazyLoadImage
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[962px] h-auto object-contain opacity-5 pointer-events-none select-none z-0"
                alt="Decorative background"
                src={bgcardImagePng}
                aria-hidden="true"
                loading="lazy"
            />
            <div className="relative  flex flex-col items-center gap-6 z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-2 w-full">
                    <span className="textDescription font-secondaryFont text-[#4c291e] tracking-wide">
                        {t('services.heading')}
                    </span>
                    <h2 className="font-primaryFont textHeadingLg text-[#9A0000] text-center font-semibold">
                        {t('services.subtitle')}
                    </h2>
                    <div className="flex items-center justify-center  w-full">
                        <div className="flex items-center w-full max-w-md">
                            {/* Left arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="w-2 h-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', transform: 'rotate(45deg)' }}></div>
                                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            </div>

                            {/* Center dots with continuous line: small-small-big-small-small */}
                            <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            </div>

                            {/* Right arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                                <div className="w-2 h-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', transform: 'rotate(45deg)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full mt-6 relative px-4 lg:px-0">
                    {/* Background images for small screens - each covers 2 cards */}
                    <div className="absolute inset-0 lg:hidden">
                        {/* First background image for cards 1-2 */}
                        <LazyLoadImage
                            className="absolute top-0 left-0 w-full h-1/2 object-cover opacity-10 pointer-events-none"
                            alt="Background 1"
                            src={bgcardImagePng}
                            loading="lazy"
                        />
                        {/* Second background image for cards 3-4 */}
                        <LazyLoadImage
                            className="absolute top-1/2 left-0 w-full h-1/2 object-cover opacity-10 pointer-events-none"
                            alt="Background 2"
                            src={bgcardImagePng}
                            loading="lazy"
                        />
                    </div>

                    {localizedItems.map((item, idx) => {
                        const img = images[idx];
                        const orderClass = getOrderClass(idx);
                        return img ? (
                            <div
                                key={idx}
                                className={`${orderClass} group w-full h-80 bg-white rounded-lg shadow-md overflow-hidden relative z-10`}
                                style={{ background: '#fff' }}
                            >
                                <LazyLoadImage
                                    src={img}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                                    style={{ opacity: 1 }}
                                    loading="lazy"
                                />
                            </div>
                        ) : (

                            <div key={idx} className={`${orderClass} group relative w-full h-80`}>
                                <div
                                    className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-0 blur-lg transition duration-500 group-hover:opacity-75"
                                ></div>
                                <div className="relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md z-10 transition duration-500 group-hover:scale-105">
                                    <LazyLoadImage
                                        src={omPng}
                                        alt="Om symbol"
                                        className="w-12 h-12 mb-4 text-[#8b0000]"
                                        loading="lazy"
                                    />
                                    <h3 className="font-primaryFont textHeading text-[#4c291e] text-center mb-3 font-medium">
                                        {item.title}
                                    </h3>
                                    <p className="font-secondaryFont textDescription text-[#1E1E1E80] text-center leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;