import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

export const ContactSection: React.FC = () => {
    return (
        <section className="flex mt-[20px]">
            <div className="relative w-[602px] -mt-5 h-[845px] bg-[url(/image-7.png)] bg-cover bg-[50%_50%]">
                <Card className="absolute w-[478px] h-[636px] top-[97px] left-[62px] bg-[#ece5df] rounded-none">
                    <CardContent className="p-0">
                        <div className="flex flex-col w-[430px] items-center mt-[34px] mx-auto">
                            <div className="flex flex-col w-[415px] items-center">
                                <h3 className="relative w-fit mt-[-1.00px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-xl tracking-[0] leading-[normal]">
                                    Reach Out to us
                                </h3>
                                <img
                                    className="mt-2 w-[368px] h-5"
                                    alt="Decorative Line"
                                    src="/line-4.png"
                                />
                                <h2 className="relative w-[395px] mt-[10px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-4xl tracking-[0] leading-[normal]">
                                    We will get Back to You
                                </h2>
                            </div>
                            <p className="self-stretch [font-family:'Tenor_Sans',Helvetica] font-normal text-[#1e1e1e80] text-sm text-center tracking-[0] leading-[normal] mt-2">
                                Your bridge to meaningful communication and personalized
                                assistance, we&#39;re here to listen and assist you
                            </p>
                        </div>

                        <form className="flex flex-col gap-[10px] mt-[46px] border-white mx-auto max-w-[430px]">
                            <div className="flex gap-4">
                                <Input
                                    className="w-[220px] p-2.5 bg-white rounded-none"
                                    placeholder="First Name"
                                />
                                <Input
                                    className="w-[220px] p-2.5 bg-white rounded-none"
                                    placeholder="Last Name"
                                />
                            </div>
                            <Input
                                className="w-full p-2.5 bg-white rounded-none mt-2"
                                placeholder="Mobile Number"
                            />
                            <Input
                                className="w-full p-2.5 bg-white rounded-none mt-2"
                                placeholder="Email ID"
                            />
                            <Textarea
                                className="w-full h-[100px] p-2.5 bg-white rounded-none mt-2"
                                placeholder="Message"
                            />
                            <Button className="w-[138px] h-[37px] mt-[52px] mx-auto bg-[#8b0000] rounded-none">
                                <span className="[-webkit-text-stroke:0.5px_#ffffff] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                                    Submit
                                </span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="relative w-[838px] h-[847px] mb-10 -mt-5">
                <img
                    className="w-full h-full object-cover"
                    alt="Image"
                    src="/image-6.png"
                />
                <div className="absolute w-[470px] top-[909px] left-[-521px] [font-family:'Marcellus',Helvetica] text-[#8b0000] text-[40.9px] leading-[normal] font-normal tracking-[0]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing eli
                </div>
                <div className="absolute w-[378px] top-[915px] left-0 [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-base leading-[normal] font-normal tracking-[0]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat.
                </div>
                <Button className="absolute w-[138px] top-[950px] left-[526px] bg-[#8b0000] rounded-none">
                    <span className="[-webkit-text-stroke:0.5px_#ffffff] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                        Read Articles
                    </span>
                </Button>
            </div>
        </section>
    );
}; 