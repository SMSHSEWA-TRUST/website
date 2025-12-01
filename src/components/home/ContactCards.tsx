
import { Card, CardContent } from "../ui/card";
import connectIcon from '@/assets/images/connect.png';
import callIcon from '@/assets/images/call.gif';
import donateIcon from '@/assets/images/donate.png';
import timeIcon from '@/assets/images/time.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useI18n } from '@/lib/i18n';

const ContactCards = (): JSX.Element => {
    const { t } = useI18n();

    return (
        <section className="w-full flex flex-col gap-6 lg:flex-row md:gap-6 mt-10 px-4 md:px-16 lg:px-24  mb-10">
            {/* Connect with Us */}
            {/* Contact Cards */}
            <div className="w-full grid grid-cols-1  xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-6 lg:mt-4">
                {/* Connect with Us */}
                <div className="group relative h-full w-full">
                    {/* 1. Glow Effect Layer (Background) */}
                    {/* <div
                                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-0 blur-lg transition duration-500 group-hover:opacity-75"
                            ></div> */}

                    {/* 2. Main Card Layer (Foreground with Zoom) */}
                    <Card className="relative z-10 flex h-full flex-col justify-between border-0 bg-[#8b0000] transition duration-500 focus:outline-none group-hover:scale-105">
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
                                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-0 blur-lg transition duration-500 group-hover:opacity-75"
                            ></div> */}

                    {/* Main Card Layer (Foreground with Zoom) */}
                    <Card className="relative z-10 flex h-full flex-col justify-between border-0 bg-[#ece5df] transition duration-500 focus:outline-none group-hover:scale-105">
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
                                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-0 blur-lg transition duration-500 group-hover:opacity-75"
                            ></div> */}

                    {/* Main Card Layer (Foreground with Zoom) */}
                    <Card className="relative z-10 flex h-full flex-col justify-between border-0 bg-[#d05e2d] transition duration-500 focus:outline-none group-hover:scale-105">
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
        </section>
    );
};

export default ContactCards;