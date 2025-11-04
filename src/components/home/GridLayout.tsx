import { Button } from "../ui/button";
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { useGetFeature } from '@/api/FeatureQueries';

// Image imports
import instagramIcon from '@/assets/images/instalogo.svg';


const GridLayout = (): JSX.Element => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { data } = useGetFeature();
    const galleryImages = data?.data?.filter((item: any) => item.purpose === 'galleryImage') || [];
    return (
        <section className="w-full mt-4 ">
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 gap-2 h-auto lg:h-[700px]">

                {/* Left Content (mobile: first) */}
                <div className="pl-8 md:pl-16 rounded-lg lg:rounded-2xl flex-1 flex flex-col justify-center order-1 lg:col-start-1 lg:row-start-1">
                    <div className="max-w-lg">
                        <h2 className="textHeading font-normal text-[rgba(76,41,30,1)] font-primaryFont leading-tight  ">
                            {t('grid.heading')}
                        </h2>
                        <p className=" textDescription text-[#1e1e1e]/50 font-secondaryFont leading-relaxed mb-4 lg:mb-8">
                            {t('grid.lead')}
                        </p>
                        <div className="flex gap-2">
                            <Button className="group border border-[#8b0000] bg-white hover:bg-[#8b0000] text-[#8b0000] hover:text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg transition-colors duration-200 font-secondaryFont"
                                onClick={() => window.open('https://www.instagram.com/smshsewatrust/', '_blank')}>
                                <img src={instagramIcon} alt="Instagram" className="w-5 h-5 lg:w-6 lg:h-6 mr-2 filter transition duration-200 group-hover:invert" />
                                <span className="font-secondaryFont font-normal textDescription tracking-wide">
                                    {t('grid.instagram')}
                                </span>
                            </Button>
                            <Button onClick={() => navigate('/gallery')} className="border border-[#8b0000] bg-white hover:bg-[#8b0000] text-[#8b0000] hover:text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg transition-colors duration-200 font-secondaryFont">
                                <span className="font-secondaryFont font-normal textDescription tracking-wide">
                                    {t('grid.gallery')}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Left Two Images (mobile: second) */}
                <div className="grid grid-cols-2 flex-1  gap-2 order-2 lg:col-start-1 lg:row-start-2 px-2 lg:px-0  lg:pb-2">
                    <div className="relative overflow-hidden rounded-lg lg:rounded-2xl group">
                        <img
                            className="w-full h-32 sm:h-40 lg:h-full object-cover "
                            alt="Portrait Image 2"
                            src={galleryImages[0]?.fileUrl}
                        />
                    </div>
                    <div className="relative overflow-hidden rounded-lg lg:rounded-2xl group">
                        <img
                            className="w-full h-32 sm:h-40 lg:h-full object-cover "
                            alt="Temple Image 2"
                            src={galleryImages[1]?.fileUrl}
                        />
                    </div>
                </div>

                {/* Large Image (mobile: third) */}
                <div className="relative overflow-hidden  flex-1 group order-3 lg:col-start-2 lg:row-start-2 px-2 lg:px-0 lg:pb-2">
                    <img
                        className="w-full h-40 sm:h-48 lg:h-full object-cover rounded-lg "
                        alt="Large Temple Image"
                        src={galleryImages[2]?.fileUrl}
                    />
                </div>

                {/* Right Two Images (mobile: last) */}
                <div className="grid grid-cols-2 flex-1  gap-2 order-4 lg:col-start-2 lg:row-start-1  px-2 lg:px-0 pb-2 lg:pb-0">
                    <div className="relative overflow-hidden rounded-lg lg:rounded-2xl group">
                        <img
                            className="w-full h-32 sm:h-40 lg:h-full object-cover "
                            alt="Portrait Image 2"
                            src={galleryImages[3]?.fileUrl}
                        />
                    </div>
                    <div className="relative overflow-hidden rounded-lg lg:rounded-2xl group ">
                        <img
                            className="w-full h-32 sm:h-40 lg:h-full object-cover "
                            alt="Temple Image 2"
                            src={galleryImages[4]?.fileUrl}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default GridLayout;