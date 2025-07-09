import { Button } from "../ui/button";

const GridLayout = (): JSX.Element => {
    return (
        <section className="relative w-[1440px] h-[681px] mt-[40px]">
            <div className="grid grid-cols-4 grid-rows-2 h-full">
                <div className="col-span-2 row-span-1 bg-[#f4f0ec]">
                    <div className="flex flex-col w-[596px] items-start gap-[21px] relative top-[66px] left-[81px]">
                        <h3 className="relative w-[506px] mt-[-1.00px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-4xl leading-[normal] font-normal tracking-[0]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing eli
                        </h3>
                        <p className="relative self-stretch [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-base leading-[normal] font-normal tracking-[0]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <Button className="w-[137.53px] h-[37px] bg-[#8b0000] rounded-none">
                            <span className="[-webkit-text-stroke:0.5px_#ffffff] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                                CTA Button
                            </span>
                        </Button>
                    </div>
                </div>
                <div className="col-span-1 row-span-1 bg-[#8b0000]">
                    <img
                        className="w-[303px] h-[323px] mt-2 ml-7"
                        alt="Image"
                        src="/temp-image-11.png"
                    />
                </div>
                <div className="col-span-1 row-span-1">
                    <img
                        className="w-full h-full object-cover"
                        alt="Image"
                        src="/temp-image-10.png"
                    />
                </div>
                <div className="col-span-1 row-span-1">
                    <img
                        className="w-full h-full object-cover"
                        alt="Image"
                        src="/temp-image-8.png"
                    />
                </div>
                <div className="col-span-1 row-span-1 bg-white">
                    <img
                        className="w-[303px] h-[323px] mt-2 ml-[25px] object-cover"
                        alt="Image"
                        src="/temp-image-2.png"
                    />
                </div>
                <div className="col-span-2 row-span-1">
                    <img
                        className="w-full h-full object-cover"
                        alt="Image"
                        src="/temp-image-9.png"
                    />
                </div>
            </div>
        </section>
    );
};

export default GridLayout; 