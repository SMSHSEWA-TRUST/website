
import { Card, CardContent } from "../ui/card";
import connectIcon from '@/assets/images/connect.png';
import callIcon from '@/assets/images/call.png';
import donateIcon from '@/assets/images/donate.png';
import timeIcon from '@/assets/images/time.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useI18n } from '@/lib/i18n';

const ContactCards = (): JSX.Element => {
    const { t } = useI18n();

    return (
        <section className="w-full flex flex-col gap-6 lg:flex-row md:gap-6 mt-10 px-4 md:px-16 lg:px-24  mb-10">
            {/* Connect with Us */}
            <Card className="flex-1 bg-[#8b0000]   flex flex-col justify-between">
                <CardContent className="p-6 flex flex-col h-full rounded-md shadow-md">
                    <div className="flex-1">
                        <LazyLoadImage className="w-12 h-12 mb-4" alt="Temple Icon" src={connectIcon} loading="lazy" />
                        <h3 className="text-white font-primaryFont textHeading  mb-3 ">{t('divine.connect.title')}</h3>
                        <p className="text-white textDescription font-normal mb-6 font-secondaryFont whitespace-pre-line">
                            {t('divine.connect.desc')}
                        </p>
                    </div>
                    <div className="flex items-center mt-auto">
                        <LazyLoadImage className="w-7 h-7 mr-3" alt="Phone" src={callIcon} loading="lazy" />
                        <span className="text-white font-normal font-secondaryFont textDescription ">{t('header.phone')}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Donate for Cause */}
            <Card className="flex-1 bg-[#ece5df]   flex flex-col justify-between">
                <CardContent className="p-6 flex flex-col h-full shadow-md rounded-md">
                    <div className="flex-1">
                        <LazyLoadImage className="w-12 h-12 mb-4" alt="Charity Icon" src={donateIcon} loading="lazy" />
                        <h3 className="text-[#4c291e] font-primaryFont textHeading mb-3">{t('divine.donate.title')}</h3>
                        <p className="text-[#4c291e] textDescription font-normal mb-6 font-secondaryFont whitespace-pre-line">
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
            <Card className="flex-1 bg-[#d05e2d] rounded-md  flex flex-col justify-between">
                <CardContent className="p-6 flex flex-col h-full shadow-md bg-secondaryColor rounded-md">
                    <div className="flex-1">
                        <LazyLoadImage className="w-12 h-12 mb-4" alt="Time Icon" src={timeIcon} loading="lazy" />
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
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default ContactCards;