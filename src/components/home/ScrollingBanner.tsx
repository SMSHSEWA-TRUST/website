import React from 'react';

const ScrollingBanner = (): JSX.Element => {
    return (
        <div className="flex w-full h-[82px] items-center gap-[26px] px-20 py-[15px] mt-[0px] bg-[#8b0000] overflow-hidden">
            <div className="flex items-center gap-[26px] animate-marquee">
                <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    || JAI SHREE MAHAKALESHWAR ||
                </div>
                <img
                    className="relative w-[41px] h-[41px]"
                    alt="Om symbol"
                    src="/om-scroll.png"
                />
                <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    || JAI SHREE SALASAR BALAJI ||
                </div>
                <img
                    className="relative w-[41px] h-[41px]"
                    alt="Om symbol"
                    src="/om-scroll.png"
                />
                <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    || JAI SHREE MAHAKALESHWAR ||
                </div>
                <img
                    className="relative w-[41px] h-[41px]"
                    alt="Om symbol"
                    src="/om-scroll.png"
                />
                <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    || JAI SHREE SALASAR BALAJI ||
                </div>
                {/* Duplicate content for seamless scrolling */}
                <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    || JAI SHREE MAHAKALESHWAR ||
                </div>
                <img
                    className="relative w-[41px] h-[41px]"
                    alt="Om symbol"
                    src="/om-scroll.png"
                />
                <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    || JAI SHREE SALASAR BALAJI ||
                </div>
                <img
                    className="relative w-[41px] h-[41px]"
                    alt="Om symbol"
                    src="/om-scroll.png"
                />
            </div>
        </div>
    );
};

export default ScrollingBanner; 