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
    return (
        <section className="w-full px-4 md:px-16 lg:px-24   py-9 lg:py-10">
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

                        <h3 className="font-primaryFont text-base font-semibold text-[rgba(30, 30, 30, 0.5)]">{t('about.whyTitle')}</h3>

                        <p className="mt-2 text-[rgba(30, 30, 30, 0.5)] font-secondaryFont textDescription font-normal leading-relaxed">
                            {t('about.whyDescription')}
                        </p>
                    </div>

                    {/* Services Grid - 2x2 icons with labels + Join button */}
                    <div className="space-y-6">
                        {/* large screens: show as a horizontal row that wraps; small screens wrap naturally */}
                        <div className="flex flex-row flex-wrap gap-12 items-center">
                            {(t('about.services') as string[] || [
                                'Gaushala',
                                'Bhojanalaya',
                                'Aushadhalaya',
                                'Cultural & Meditation Centre',
                                'Dhyaan Kendra',
                                'Grand temple',
                            ]).map((label, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center w-1/4 sm:w-1/4 md:w-1/6 lg:w-1/6" style={{ minWidth: 140 }}>
                                    <div className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-center w-[72px] h-[72px]">
                                        <LazyLoadImage
                                            className="w-[40px] h-[40px] object-contain"
                                            alt={label}
                                            src={image2}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="mt-3 px-2">
                                        <span title={label} className="text-[rgba(76, 41, 30, 1)] font-primaryFont text-sm leading-tight max-w-[200px] break-words whitespace-normal block">{label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-start">
                            <button className="bg-[#7a0b0b] hover:bg-[#8f1616] text-white py-2 px-6 rounded-md shadow-md font-secondaryFont">
                                {t('about.joinButton')}
                            </button>
                        </div>
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