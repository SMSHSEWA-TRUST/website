
import divinePng from '@/assets/images/divine-2.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Card, CardContent } from "../ui/card";
import { useI18n } from '@/lib/i18n';
import connectIcon from '@/assets/images/connect.png';
import callIcon from '@/assets/images/call.png';
import donateIcon from '@/assets/images/donate.png';
import timeIcon from '@/assets/images/time.png';

const DivinePower = (): JSX.Element => {
    const { t } = useI18n();

    return (
        <section className="relative w-full flex flex-col items-center justify-center mb-9 lg:mb-16">
            {/* Desktop/Large screen: text overlays image with cards */}
            <div
                className="relative w-full min-h-[95vh] flex items-center justify-center"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 20%), url(${divinePng})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))",
                }}
            >                {/* Background image with overlay */}
                <div className="absolute inset-0 bg-black/20 z-10" />

                {/* Content container with title, description and cards */}
                <div className="relative z-20 w-full flex flex-col items-center justify-center mt-8 lg:mt-0 mb-8 lg:mb-0 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
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
                    <div className="w-full grid grid-cols-1  xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-8">
                        {/* Connect with Us */}
                        <Card className="bg-[#8b0000]   flex flex-col justify-between border-0 focus:outline-none">
                            <CardContent className="p-4 md:p-6 flex flex-col h-full rounded-md shadow-md">
                                <div className="flex-1">
                                    <LazyLoadImage className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Temple Icon" src={connectIcon} loading="lazy" />
                                    <h3 className="text-white font-primaryFont textHeading  mb-3 ">{t('divine.connect.title')}</h3>
                                    <p className="text-white textDescription font-normal mb-6 font-secondaryFont">
                                        {t('divine.connect.desc')}
                                    </p>
                                </div>
                                <div className="flex items-center mt-auto">
                                    <LazyLoadImage className="w-6 h-6 md:w-7 md:h-7 mr-3" alt="Phone" src={callIcon} loading="lazy" />
                                    <span className="text-white font-normal font-secondaryFont textDescription ">{t('divine.phone')}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Donate for Cause */}
                        <Card className="bg-[#ece5df]   flex flex-col justify-between">
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

                        {/* Office Timings */}
                        <Card className="bg-[#d05e2d] rounded-md  flex flex-col justify-between border-0 focus:outline-none">
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
                                    <p className="mt-4 text-white textDescription text-center font-secondaryFont">
                                        {t('divine.office.invite')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>


        </section>
    );
};

export default DivinePower;