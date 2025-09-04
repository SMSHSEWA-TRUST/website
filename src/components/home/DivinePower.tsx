
import divinePng from '@/assets/images/divine-2.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Card, CardContent } from "../ui/card";
import connectIcon from '@/assets/images/connect.png';
import callIcon from '@/assets/images/call.png';
import donateIcon from '@/assets/images/donate.png';
import timeIcon from '@/assets/images/time.png';

const DivinePower = (): JSX.Element => {
    return (
        <section className="relative w-full flex flex-col items-center justify-center">
            {/* Desktop/Large screen: text overlays image with cards */}
            <div
                className="relative w-full min-h-[100vh] flex items-center justify-center"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 20%), url(${divinePng})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))",
                }}
            >                {/* Background image with overlay */}
                <div className="absolute inset-0 bg-black/20 z-10" />

                {/* Content container with title, description and cards */}
                <div className="relative z-20 w-full flex flex-col items-center justify-center py-8 sm:py-10 md:py-14 lg:py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
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
                            Feel the Surreal Divine Power

                        </h2>
                        <p className="mt-6 sm:mt-8  text-white textDescription text-center font-secondaryFont leading-relaxed drop-shadow">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-8">
                        {/* Connect with Us */}
                        <Card className="bg-[#8b0000]   flex flex-col justify-between border-0 focus:outline-none">
                            <CardContent className="p-4 md:p-6 flex flex-col h-full rounded-md shadow-md">
                                <div className="flex-1">
                                    <LazyLoadImage className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Temple Icon" src={connectIcon} loading="lazy" />
                                    <h3 className="text-white font-primaryFont textHeading  mb-3 ">Connect with Us</h3>
                                    <p className="text-white textDescription font-normal mb-6 font-secondaryFont">
                                        Reach out and connect with our church community. We're here to welcome, assist, and share in your journey of faith.
                                    </p>
                                </div>
                                <div className="flex items-center mt-auto">
                                    <LazyLoadImage className="w-6 h-6 md:w-7 md:h-7 mr-3" alt="Phone" src={callIcon} loading="lazy" />
                                    <span className="text-white font-normal font-secondaryFont textDescription ">+91 9876543210</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Donate for Cause */}
                        <Card className="bg-[#ece5df]   flex flex-col justify-between">
                            <CardContent className="p-4 md:p-6 flex flex-col h-full shadow-md rounded-md">
                                <div className="flex-1">
                                    <LazyLoadImage className="w-10 h-10 md:w-12 md:h-12 mb-4" alt="Charity Icon" src={donateIcon} loading="lazy" />
                                    <h3 className="text-[#4c291e] font-primaryFont textHeading mb-3">Donate for Cause</h3>
                                    <p className="text-[#4c291e] textDescription font-normal mb-6 font-secondaryFont">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq
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
                                    <h3 className="text-white font-primaryFont textHeading mb-6">Office Timings</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-white textDescription font-secondaryFont font-normal">
                                            <span>Monday - Friday</span>
                                            <span>8:00 AM - 8:00 PM</span>
                                        </div>
                                        <div className="flex justify-between text-white textDescription font-secondaryFont font-normal">
                                            <span>Saturday - Sunday</span>
                                            <span>10:00 AM - 6:00 PM</span>
                                        </div>
                                    </div>
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