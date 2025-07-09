import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="relative w-[1440px] h-[595px] mt-[40px] bg-[#8b0000]">
            <div className="absolute w-[643px] h-[203px] top-6 left-[400px]">
                <div className="absolute w-[114px] h-[114px] top-0 left-[263px]">
                    <div className="relative h-[114px]">
                        <div className="absolute w-[100px] h-[100px] top-[7px] left-[7px] bg-white rounded-[50px]" />
                        <img
                            className="absolute w-[114px] h-[114px] top-0 left-0 object-cover"
                            alt="Temple Logo"
                            src="/temp-logo.png"
                        />
                    </div>
                </div>
                <div className="absolute w-[643px] top-[113px] left-0 [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000] [font-family:'Marcellus_SC',Helvetica] font-normal text-white text-4xl text-center tracking-[0] leading-[normal]">
                    Shree Mahakaleshwar Salasar Hanuman Sewa Trust
                    <img src="/footer-line.png" />
                </div>
            </div>

            <div className="absolute w-[614px] top-[253px] left-[413px] [font-family:'Tenor_Sans',Helvetica] text-white text-base text-center leading-[normal] font-normal tracking-[0]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
            </div>

            <div className="absolute w-[604px] h-5 top-[231px] left-[418px]">
                <div className="relative w-[596px] h-3 top-1 left-1 bg-[url(/line-2.svg)] bg-[100%_100%]"></div>
            </div>

            <div className="absolute w-[156px] top-[93px] left-20 [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000] [font-family:'Marcellus_SC',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
                Special Links
            </div>

            <div className="flex flex-col space-y-8 absolute top-[132px] left-[81px]">
                <div className="w-[203px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                    Link 1
                </div>
                <div className="w-[182px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                    Link 2
                </div>
                <div className="w-[203px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                    Link 3
                </div>
                <div className="w-[182px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                    Link 4
                </div>
                <div className="w-[203px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                    Link 5
                </div>
            </div>

            <div className="absolute w-[222px] h-[159px] top-[87px] left-[1147px]">
                <div className="absolute w-[105px] -top-px left-[108px] [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000] [font-family:'Marcellus_SC',Helvetica] font-normal text-white text-xl text-right tracking-[0] leading-[normal]">
                    Info
                </div>
                <div className="absolute w-[203px] top-[38px] left-[11px] text-white text-base text-center [font-family:'Tenor_Sans',Helvetica] font-normal tracking-[0] leading-[normal]">
                    Email: info@support.com
                </div>
                <div className="absolute w-[182px] top-[70px] left-8 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-[normal]">
                    Phone No: 9876543210
                </div>
                <div className="absolute w-[214px] top-[102px] left-0 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base text-right tracking-[0] leading-[normal]">
                    Address : 1080 Brickell Ave, Miami ( Florida )<br />
                    United States
                </div>
            </div>

            <div className="absolute w-[132px] h-5 top-[353px] left-[657px]">
                <div className="relative h-5">
                    <div className="absolute w-5 h-5 top-0 left-0 bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
                    <div className="absolute w-5 h-5 top-0 left-[27px] bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
                    <div className="absolute w-5 h-5 top-0 left-[54px] bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
                    <div className="absolute w-5 h-5 top-0 left-[82px] bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
                    <div className="absolute w-5 h-5 top-0 left-28 bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
                    <div className="absolute w-[123px] h-[13px] top-1 left-1.5">
                        <div className="absolute w-2 h-[13px] top-0 left-0">
                            <img
                                className="absolute w-[7px] h-[13px] top-0 left-px"
                                alt="Facebook"
                                src="/Facebook.png"
                            />
                        </div>
                        <div className="absolute w-[13px] h-2.5 top-px left-[25px]">
                            <img
                                className="absolute w-[13px] h-2.5 top-0 left-px"
                                alt="Twitter"
                                src="/Twitter.png"
                            />
                        </div>
                        <div className="absolute w-[13px] h-[13px] top-0 left-[52px]">
                            <img
                                className="absolute w-[13px] h-[13px] top-0 left-px"
                                alt="Instagram"
                                src="/Instagram.png"
                            />
                        </div>
                        <div className="absolute w-[13px] h-[13px] -top-px left-20">
                            <img
                                className="absolute w-[13px] h-[13px] top-0 left-px"
                                alt="LinkedIn"
                                src="/LinkedIn.png"
                            />
                        </div>
                        <div className="absolute w-[15px] h-2.5 top-px left-[109px]">
                            <img
                                className="absolute w-[13px] h-[13px] top-0 left-px"
                                alt="youtube"
                                src="/YouTube.png"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="inline-flex items-center gap-[22px] absolute top-[427px] left-[513px]">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    Partnerships
                </div>
                <div className="relative w-2.5 h-2.5 bg-[#d05e2d] rounded-[5px]" />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    Temple Support
                </div>
                <div className="relative w-2.5 h-2.5 bg-[#d05e2d] rounded-[5px]" />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    Privacy Policy
                </div>
            </div>

            <img src="/footer-line-2.png" className="absolute w-[1293px] h-3 top-[487px] left-[74px]" />

            <div className="absolute w-[430px] h-[22px] top-[519px] left-[81px]">
                <div className="absolute top-0 left-0 flex items-center [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    Made with
                    <span className="mx-2 text-[20px] align-middle">🧡</span>
                    by Nexteir Technologies Pvt. Ltd. in India
                    <img className="ml-2 w-6 h-4 inline-block align-middle" src="/india.png" alt="India Flag" />
                </div>
            </div>

            <div className="absolute top-[519px] left-[981px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                All Rights Reserved © 2025 | Terms &amp; Conditions
            </div>
        </footer>
    );
}; 