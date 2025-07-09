import React from 'react';
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const DonationSection = (): JSX.Element => {
    // Stats data
    const stats = [
        { value: "100k +", label: "Lorem ipsum dolor" },
        { value: "100k +", label: "Lorem ipsum dolor" },
        { value: "100k +", label: "Lorem ipsum dolor" },
        { value: "100k +", label: "Lorem ipsum dolor" },
    ];

    // Donation data
    const donations = [
        {
            title: "Donation 1",
            description: "(What is Included, a small Description will go here)",
        },
        {
            title: "Donation 2",
            description: "(What is Included, a small Description will go here)",
        },
        {
            title: "Donation 3",
            description: "(What is Included, a small Description will go here)",
        },
        {
            title: "Custom Donation",
            description: "(What is Included, a small Description will go here)",
        },
    ];

    return (
        <section className="relative w-[1440px] h-[1576px] mt-[40px]">
            <img
                className="absolute w-[810px] h-[810px] top-0 left-0 object-cover"
                alt="Decorative Image"
                src="/mand-9-min 1.png"
            />

            <div className="absolute w-[1440px] h-[1424px] top-[69px] left-0 bg-[#f4f0ec]" />

            <div className="absolute w-[630px] top-[137px] left-[657px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-4xl leading-[normal] font-normal tracking-[0]">
                Lorem ipsum dolor sit amet, consectetur adipiscing eli
            </div>

            <div className="absolute w-[368px] top-[145px] left-[188px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-xl leading-[normal] font-normal tracking-[0]">
                Lorem ipsum dolor sit amet, consectetur adipiscing eli
            </div>

            <img
                className="absolute w-[542px] h-5 top-[239px] left-[647px]"
                alt="Decorative Line"
                src="/Frame 24.png"
            />

            <div className="flex flex-col space-y-6 absolute top-[231px] left-[183px]">
                {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <div className="w-[197px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-5xl tracking-[0] leading-[normal]">
                            {stat.value}
                        </div>
                        <div className="w-[197px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-xl font-normal tracking-[0] leading-[normal]">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex absolute top-[277px] left-[657px] space-x-4">
                <img
                    className="w-[305px] h-[272px] object-cover"
                    alt="Image"
                    src="/image-4.png"
                />
                <div className="flex flex-col w-[378px] space-y-4">
                    <div className="[font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-base leading-[normal] font-normal tracking-[0]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                    <div className="flex flex-col w-[222px] items-start gap-[15px] mt-[25px]">
                        <Separator className="relative self-stretch w-full h-px mt-[-1.00px]" />
                        <div className="relative w-[186px] mb-7 [font-family:'Marcellus',Helvetica] font-normal text-[#8b0000] text-xl tracking-[0] leading-[normal]">
                            John Doe
                        </div>
                    </div>
                    <Button className="w-24 h-[30px] mt-[80px] bg-[#8b0000] rounded-none">
                        <span className="relative w-fit mt-[-4.17px] mb-[-2.77px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                            Know More
                        </span>
                    </Button>
                </div>
            </div>

            <div className="absolute w-[30px] h-[30px] top-[508px] left-[1330px] bg-white" />
            <div className="absolute w-[30px] h-[30px] top-[508px] left-[1293px] bg-[#8b0000]" />
            <img
                className="left-[1335px] absolute w-[21px] h-[15px] top-[516px]"
                alt="Arrow"
                src="/Arrow 1.png"
            />
            <img
                className="left-[1298px] absolute w-[21px] h-[15px] top-[516px]"
                alt="Arrow"
                src="/Arrow 2.png"
            />

            <img
                className="absolute w-[785px] h-[810px] top-[623px] left-0 object-cover"
                alt="Decorative Image"
                src="/mand-9-min 1.png"
            />

            <img
                className="absolute w-[1366px] h-[569px] top-[924px] left-[27px] object-cover"
                alt="Image"
                src="/image-5.png"
            />

            <div className="absolute w-[1116px] h-[273px] top-[768px] left-[38px] bg-[#8b0000]">
                <img
                    className="absolute w-[84px] h-[92px] top-0 left-0"
                    alt="Decorative Image"
                    src="/mand-9-min 2.png"
                />
                <img
                    className="absolute w-[145px] h-[145px] top-[117px] left-[426px]"
                    alt="Decorative Image"
                    src="/mand-9-min 3.png"
                />

                <div className="absolute w-[414px] top-[53px] left-[149px] [-webkit-text-stroke:1px_#daa520] [font-family:'Marcellus',Helvetica] text-white text-4xl leading-[normal] font-normal tracking-[0]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing eli
                </div>

                <div className="flex flex-col space-y-4 absolute top-[34px] left-[582px]">
                    {donations.map((donation, index) => (
                        <div
                            key={index}
                            className="flex w-[479px] items-center justify-between"
                        >
                            <div className="flex flex-col w-[322px] items-start gap-[3px]">
                                <div className="relative self-stretch mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                                    {donation.title}
                                </div>
                                <div className="relative self-stretch [font-family:'Tenor_Sans',Helvetica] font-normal text-[#ffffff80] text-xs tracking-[0] leading-[normal]">
                                    {donation.description}
                                </div>
                            </div>
                            <Button className="w-24 h-[30px] bg-white rounded-none">
                                <span className="relative w-fit mt-[-4.17px] mb-[-2.77px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#8b0000] text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                                    Donate
                                </span>
                            </Button>
                            {index < donations.length - 1 && (
                                <img
                                    className="absolute w-[479px] h-px top-[57px] left-[620px] object-cover"
                                    alt="Line"
                                    src="/line-9.svg"
                                    style={{ transform: `translateY(${index * 58}px)` }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute w-[771px] h-[167px] top-[1406px] left-[622px] bg-[#d05e2d]">
                <img
                    className="absolute w-[84px] h-[92px] top-0 left-0"
                    alt="Decorative Image"
                    src="/mand-9-min 4.png"
                />
                <img
                    className="absolute w-[84px] h-[92px] top-[78px] left-[687px]"
                    alt="Decorative Image"
                    src="/mand-9-min 5.png"
                />

                <div className="flex justify-around items-center h-full">
                    {Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <Avatar className="w-[74px] h-[74px] bg-[#8b000080] rounded-[37px] border border-solid border-white" />
                                <div className="w-[153px] mt-5 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] text-center">
                                    Lorem Ispum Dolor
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default DonationSection; 