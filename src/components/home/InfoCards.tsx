
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

// Image imports
import callPng from '@/assets/images/call.png';
import connectPng from '@/assets/images/connect.png';
import donatePng from '@/assets/images/donate.png';
import timePng from '@/assets/images/time.png';

export const InfoCards: React.FC = () => {
    return (
        <section className="flex gap-[20px] mt-[40px] mx-[80px]">
            {/* Connect with Us Card */}
            <Card className="w-[413px] h-[295px] bg-[#8b0000] rounded-none">
                <CardContent className="p-0">
                    <div className="absolute w-[182px] top-[100px] left-[25px] [font-family:'Marcellus',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                        Connect with Us
                    </div>
                    <div className="absolute w-[334px] top-[140px] left-[25px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                        Reach out and connect with our temple <br />
                        community. We&#39;re here to welcome, assist, <br />
                        and share in your journey of faith.
                    </div>
                    <div className="absolute w-[182px] top-[231px] left-[68px] [font-family:'Marcellus',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                        +91 9876543210
                    </div>
                    <div className="absolute w-[33px] h-[33px] top-[229px] left-[25px]">
                        <img
                            className="absolute w-[33px] h-[33px] top-0 left-0"
                            alt="Phone icon"
                            src={callPng}
                        />
                    </div>
                    <div className="absolute w-14 h-14 top-[22px] left-[25px]">
                        <img
                            className="absolute w-[52px] h-[52px] top-0 left-0"
                            alt="Connect icon"
                            src={connectPng}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Donate for Cause Card */}
            <Card className="w-[413px] h-[295px] bg-[#ece5df] rounded-none">
                <CardContent className="p-0">
                    <div className="absolute w-[212px] top-[98px] left-[31px] [font-family:'Marcellus',Helvetica] font-normal text-black text-2xl tracking-[0] leading-[normal]">
                        Donate for Cause
                    </div>
                    <div className="absolute w-[334px] top-[138px] left-[31px] [font-family:'Tenor_Sans',Helvetica] text-black text-base leading-[normal] font-normal tracking-[0]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliq
                    </div>
                    <img
                        className="absolute w-[52px] h-[52px] top-[25px] left-[25px]"
                        alt="Charity icon"
                        src={donatePng}
                    />
                    <Button className="w-24 h-[30px] absolute top-[214px] left-[31px] bg-[#8b0000] rounded-none">
                        <span className="relative w-fit mt-[-4.17px] mb-[-2.77px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                            Donate
                        </span>
                    </Button>
                </CardContent>
            </Card>

            {/* Office Timings Card */}
            <Card className="w-[413px] h-[295px] bg-[#d05e2d] rounded-none">
                <CardContent className="p-0">
                    <div className="absolute w-[182px] top-[100px] left-7 [font-family:'Marcellus',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                        Office Timings
                    </div>
                    <div className="absolute w-[132px] top-[152px] left-7 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                        Monday - Friday
                    </div>
                    <div className="absolute w-[155px] top-[193px] left-7 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                        Saturday - Sunday
                    </div>
                    <div className="absolute w-[148px] top-[152px] left-[247px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                        8:00 AM - 8:00 PM
                    </div>
                    <div className="absolute w-[156px] top-[193px] left-[243px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                        10:00 AM - 6:00 PM
                    </div>
                    <img
                        className="absolute w-[47px] h-[47px] top-[35px] left-[31px]"
                        alt="Time icon"
                        src={timePng}
                    />
                </CardContent>
            </Card>
        </section>
    );
}; 