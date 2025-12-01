
import divinePng from '@/assets/images/Surreal Section.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Card, CardContent } from "../ui/card";
import { useI18n } from '@/lib/i18n';
import connectIcon from '@/assets/images/connect.png';
import callIcon from '@/assets/images/call.gif';
import donateIcon from '@/assets/images/donate.png';
import timeIcon from '@/assets/images/time.png';

const DivinePower = (): JSX.Element => {
    const { t } = useI18n();

    return (
        <section className="relative w-full flex flex-col items-center justify-center mb-6 lg:mb-8 px-4 md:px-16 lg:px-24 mt-6 lg:mt-8">
            {/* Desktop/Large screen: text overlays image with cards */}
            <div
                className="relative w-full flex items-center justify-center rounded-lg"
                style={{
                    backgroundImage: `url(${divinePng})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/20 z-10" />

                {/* Content container with title, description and cards */}
                <div className="relative z-20 w-full flex flex-col items-center justify-center mt-6 lg:mt-2 mb-6 lg:mb-2 px-4 lg:px-8 py-6 md:py-8 lg:py-10 xl:py-12">
                    <div className="text-center mb-8">
                        <h2
                            className="text-5xl md:text-6xl font-bold font-primaryFont"
                            style={{
                                color: '#fff',
                                WebkitTextStroke: '2px #d05e2d',
                                textShadow: '0px 2px 4px rgba(139,0,0,0.5), 0px 0.5px 0px #fff',
                                letterSpacing: '0.04em',
                            }}
                        >
                            {t('divine.heading')}

                        </h2>
                        <p className=" mt-4  text-white textDescription text-center font-secondaryFont leading-relaxed drop-shadow">
                            {t('divine.lead')}
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="w-full grid grid-cols-1  xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-6 lg:mt-4">
                        {/* Connect with Us */}
                        <div className="group relative h-full w-full">
                            {/* 1. Glow Effect Layer (Background) */}
                            {/* <div
                                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-0 blur-lg transition duration-300 group-hover:opacity-75"
                            ></div> */}

                            {/* 2. Main Card Layer (Foreground with Zoom) */}
                            <Card className="relative z-10 flex h-full flex-col justify-between border-0 bg-[#8b0000] transition duration-300 focus:outline-none group-hover:scale-105">
                                <CardContent className="flex h-full flex-col rounded-md p-4 shadow-md md:p-6">
                                    {/* Top Section */}
                                    <div className="flex-1">
                                        <LazyLoadImage
                                            className="mb-4 h-10 w-10 md:h-12 md:w-12"
                                            alt="Temple Icon"
                                            src={connectIcon}
                                            loading="lazy"
                                        />
                                        <h3 className="textHeading font-primaryFont mb-3 text-white">
                                            {t("divine.connect.title")}
                                        </h3>
                                        <p className="textDescription font-secondaryFont mb-6 font-normal text-white">
                                            {t("divine.connect.desc")}
                                        </p>
                                    </div>

                                    {/* Bottom/Footer Section */}
                                    <div className="mt-auto flex items-center">
                                        <LazyLoadImage
                                            className="mr-3 h-6 w-6 md:h-7 md:w-7"
                                            alt="Phone"
                                            src={callIcon}
                                            loading="lazy"
                                        />
                                        <span className="textDescription font-secondaryFont font-normal text-white">
                                            {t("divine.phone")}
                                        </span>
                                    </div>

                                </CardContent>
                            </Card>
                        </div>
                        {/* Donation Card */}
                        <div className="group relative h-full w-full">
                            {/* Glow Effect Layer (Background) */}
                            {/* <div
                                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-0 blur-lg transition duration-300 group-hover:opacity-75"
                            ></div> */}

                            {/* Main Card Layer (Foreground with Zoom) */}
                            <Card className="relative z-10 flex h-full flex-col justify-between border-0 bg-[#ece5df] transition duration-300 focus:outline-none group-hover:scale-105">
                                <CardContent className="p-4 md:p-6 flex flex-col h-full shadow-md rounded-md">
                                    <div className="flex-1">
                                        <LazyLoadImage className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Charity Icon" src={donateIcon} loading="lazy" />
                                        <h3 className="text-[#4c291e] font-primaryFont textHeading mb-3">{t('divine.donate.title')}</h3>
                                        <p className="text-[#4c291e] textDescription font-normal mb-6 font-secondaryFont">
                                            {t('divine.donate.desc')}
                                        </p>
                                    </div>
                                    {/* <div className="mt-auto">
                        <Button className="w-24 h-10 bg-[#8b0000] rounded-md text-white text-[17px] lg:text-[24px] font-secondaryFont font-normal hover:bg-[#7a0000] transition-colors">
                            Donate
                        </Button>
                    </div> */}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Office Timings */}
                        <div className="group relative h-full w-full">
                            {/* Glow Effect Layer (Background) */}
                            {/* <div
                                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-0 blur-lg transition duration-300 group-hover:opacity-75"
                            ></div> */}

                            {/* Main Card Layer (Foreground with Zoom) */}
                            <Card className="relative z-10 flex h-full flex-col justify-between border-0 bg-[#d05e2d] transition duration-300 focus:outline-none group-hover:scale-105">
                                <CardContent className="p-4 md:p-6 flex flex-col h-full shadow-md bg-secondaryColor rounded-md">
                                    <div className="flex-1">
                                        <LazyLoadImage className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Time Icon" src={timeIcon} loading="lazy" />
                                        <h3 className="text-white font-primaryFont textHeading mb-6">{t('divine.office.title')}</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-white textDescription font-secondaryFont font-normal">
                                                <span>{t('divine.office.weekdays')}</span>
                                                <span>{t('divine.office.weekdayHours')}</span>
                                            </div>
                                            <div className="flex justify-between text-white textDescription font-secondaryFont font-normal">
                                                <span>{t('divine.office.weekend')}</span>
                                                <span>{t('divine.office.weekendHours')}</span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-white textDescription font-secondaryFont">
                                            {t('divine.office.invite')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
};

export default DivinePower;