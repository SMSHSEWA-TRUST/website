import React from 'react';
import tempImage4 from '@/assets/images/temp-image-4.webp';
import tempImage3 from '@/assets/images/temp-image-3.webp';
import tempImage2 from '@/assets/images/temp-image-2.png';
import image2 from '@/assets/images/image 2.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useI18n } from '@/lib/i18n';




// Custom hook to detect large screen
function useIsLargeScreen() {
    const [isLarge, setIsLarge] = React.useState(false);
    React.useEffect(() => {
        const checkScreen = () => setIsLarge(window.innerWidth >= 1024);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);
    return isLarge;
}

const About = (): JSX.Element => {
    const isLargeScreen = useIsLargeScreen();
    const { t } = useI18n();
    // map assets in src/assets/images to easy lookup by filename
    // Use Vite's import.meta.glob with eager:true to get module URLs at build time.
    // Cast to any because some TS configs lack types for glob with options.
    const rawImages = (import.meta as any).glob('/src/assets/images/*.{png,jpg,jpeg,webp,svg}', { eager: true });
    const imageMap: Record<string, string> = {};
    Object.keys(rawImages).forEach((p) => {
        const mod = (rawImages as any)[p];
        const name = p.split('/').pop()!; // e.g. 'Gaushala.png'
        imageMap[name] = mod?.default ?? mod;
    });
    return (
        <section id="mission" className="w-full px-4 md:px-16 lg:px-24   py-9 lg:py-10 bg-[#F8F5F0]">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-start  ">
                {/* Left Side - Image Gallery */}
                <div className="order-2 lg:order-1">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4  ">
                        {/* Main large image - spans 2 rows */}
                        <div className="row-span-2">
                            <LazyLoadImage
                                className={
                                    isLargeScreen
                                        ? "w-full h-[100%]  object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                        : "w-full h-full mt-0 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                }
                                alt="Main temple view showcasing traditional architecture"
                                src={tempImage4}
                                loading="lazy"
                            />
                        </div>

                        {/* Top right image */}
                        <div className="row-span-1">
                            <LazyLoadImage
                                className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                alt="Temple detail view"
                                src={tempImage3}
                                loading="lazy"
                            />
                        </div>

                        {/* Bottom right image */}
                        <div className="row-span-1">
                            <LazyLoadImage
                                className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                alt="Temple courtyard view"
                                src={tempImage2}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="order-2 lg:order-2 space-y-8">
                    {/* Heading */}
                    <div className="space-y-6">
                        <h2 className="font-primaryFont  textHeadingLg font-normal text-[rgba(76, 41, 30, 1)] leading-tight">
                            {t('about.heading')}
                        </h2>

                        {/* Decorative line */}
                        <div className="flex items-center ">
                            <div className="h-[2px] bg-secondaryColor flex-1"></div>
                            <div className="w-3 h-3 bg-secondaryColor rounded-full"></div>
                            <div className="w-2 h-2 bg-secondaryColor rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-secondaryColor rounded-full"></div>
                        </div>
                    </div>

                    {/* Description: lead + Why Surat? */}
                    <div className="max-w-[600px]">
                        <p className="text-[rgba(30, 30, 30, 0.5)] font-secondaryFont textDescription font-normal leading-relaxed">
                            {t('about.lead')}
                        </p>

                        <div className="my-4" />

                        <h3 className="font-primaryFont text-[16px]  lg:text-[20px] font-semibold text-[rgba(30, 30, 30, 0.5)]">{t('about.whyTitle')}</h3>

                        <p className="mt-2 text-[rgba(30, 30, 30, 0.5)] font-secondaryFont textDescription font-normal leading-relaxed">
                            {t('about.whyDescription')}
                        </p>
                    </div>

                    {/* Services Grid - 2x2 icons with labels + Join button */}
                    <div className="space-y-6">
                        {/* large screens: show as a horizontal row that wraps; small screens wrap naturally */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {
                                // Load services from i18n. Each service expected to be { title, description, image }
                                (() => {
                                    const raw = t('about.services') as any;
                                    const fallback = [
                                        { title: 'Gaushala', description: 'for cow service and protection.', image: 'images/Gaushala.png' },
                                        { title: 'Bhojanalaya', description: 'to provide prasad and meals for devotees and the needy.', image: 'images/Sanskritik Kendra.png' },
                                        { title: 'Aushadhalaya', description: 'for holistic health and wellness.', image: 'images/Aushadhalaya.png' },
                                        { title: 'Meditation Centre', description: 'A Place Where people can connect themselves with Divine energy', image: '/images/Dhyaan kendra.png' },
                                    ];

                                    const services = Array.isArray(raw) && raw.length ? raw : fallback;

                                    return services.map((svc: any, idx: number) => {
                                        const title = typeof svc === 'string' ? svc : svc.title || '';
                                        const desc = typeof svc === 'string' ? '' : svc.description || '';
                                        // resolve svc.image which may be like 'images/Gaushala.png' or '/images/Dhyan_kendra.png'
                                        let imgPath = image2;
                                        if (svc && svc.image) {
                                            // normalize and pick filename
                                            const provided = svc.image.startsWith('/') ? svc.image.slice(1) : svc.image; // remove leading /
                                            const fileName = provided.split('/').pop() || provided;
                                            if (imageMap[fileName]) {
                                                imgPath = imageMap[fileName];
                                            } else if (svc.image.startsWith('/')) {
                                                // if user provided a leading slash path, assume it's in public/ and use as-is
                                                imgPath = svc.image;
                                            } else {
                                                // fallback to prefixing with / so dev server can serve from public if present
                                                imgPath = `/${provided}`;
                                            }
                                        }

                                        return (
                                            <div key={idx} className="w-full flex items-center gap-4 p-3 rounded-md">
                                                <div className="bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                                                    <LazyLoadImage
                                                        className="w-[60px] h-[60px] object-contain"
                                                        alt={title}
                                                        src={imgPath}
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="px-2">
                                                    <span title={title} className="text-[rgba(76, 41, 30, 1)] font-primaryFont text-lg leading-tight block">{title}</span>
                                                    {desc ? (
                                                        <p className="text-[rgba(30,30,30,0.6)] text-sm font-secondaryFont mt-1">{desc}</p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    });
                                })()
                            }
                        </div>

                        {/* <div className="mt-6 flex justify-start">
                            <button className="bg-[#7a0b0b] hover:bg-[#8f1616] text-white py-2 px-6 rounded-md shadow-md font-secondaryFont">
                                {t('about.joinButton')}
                            </button>
                        </div> */}
                    </div>

                    {/* Aarti Timings Button */}
                    {/* <div className="mt-8 flex justify-start">
                        <button className="bg-[rgba(139,0,0,1)] text-white  text-[16px] sm:text-[18px] lg:text-[20px]  px-3 py-2 rounded-md shadow-md hover:bg-[#a83232] transition-colors duration-200 font-secondaryFont">
                            Aarti Timings
                        </button>
                    </div> */}
                </div>
            </div>
        </section>
    );
};

export default About;