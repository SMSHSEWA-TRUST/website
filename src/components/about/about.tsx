import React from "react";
import AboutImg from "../../assets/images/About.webp";
import { useI18n } from "../../lib/i18n";

const About: React.FC = () => {
    const { t } = useI18n();
    return (
        <section className="w-full py-12 px-4 md:px-16 lg:px-24 ">
            <div className="  flex flex-col md:flex-row gap-8 items-start">
                {/* Left: actual image */}
                <div className="md:w-[50%]">
                    <div className="w-full h-72 md:h-[420px] lg:h-[480px] rounded-lg overflow-hidden shadow-sm">
                        <img src={AboutImg} alt="About" className="object-cover w-full h-full" />
                    </div>
                </div>

                {/* Right: heading + decorative line + text */}
                <div className="md:w-[50%] flex flex-col justify-start">
                    <div className="">
                        <div className="flex items-center">
                            <h2 className=" textHeadingLg font-primaryFont text-[#4C291E] tracking-wide">About Us</h2>


                        </div>

                        {/* Decorative line */}
                        <div className="flex items-center ">
                            <div className="h-[2px] bg-secondaryColor flex-1"></div>
                            <div className="w-3 h-3 bg-secondaryColor rounded-full"></div>
                            <div className="w-2 h-2 bg-secondaryColor rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-secondaryColor rounded-full"></div>
                        </div>

                        <p className="mt-6 textDescription text-gray-600 leading-relaxed font-secondaryFont">
                            {t("AboutpageAboutsection.content.0.paragraph1")}
                        </p>

                        <p className="mt-4 textDescription text-gray-600 leading-relaxed font-secondaryFont">
                            {t("AboutpageAboutsection.content.0.paragraph2")}
                        </p>

                       
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
