import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PaeshadImage from "../../assets/images/PrasadImage.png";
import Image1 from ".././../assets/images/BowlFoodDuotone.png"
import Image2 from ".././../assets/images/Food.png"

const ImportantParshad: React.FC = () => {
    return (
        <div className="w-full py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Side - Text Content */}
                    <div className="space-y-6">
                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-primaryFont text-[#8b0000] border-b-[4px] border-[#D05E2D] pb-3 inline-block">
                            Importance of Prashad
                        </h2>

                        {/* Description */}
                        <p className="text-[#AAAAAA] font-secondaryFont text-sm md:text-base leading-relaxed">
                            Prashad is a sacred and deeply significant offering in Hinduism, representing the grace and blessings of the Divine. It is food, often vegetarian and prepared with great reverence, that has first been offered to a deity during a ritual or ceremony to the congregation.
                        </p>

                        {/* Bullet Points with Icons */}
                        <div className="space-y-6 mt-8">
                            {/* First Point */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <img src={Image1} alt="bowl icon" className="w-6 h-6 object-contain" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#AAAAAA] font-secondaryFont text-sm md:text-base leading-relaxed">
                                        The act of receiving and consuming prashad is much more than simply eating; it is an act of communion, purification, and spiritual nourishment.
                                    </p>
                                </div>
                            </div>

                            {/* Second Point */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <img src={Image2} alt="blessing hands icon" className="w-6 h-6 object-contain" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#AAAAAA] font-secondaryFont text-sm md:text-base leading-relaxed">
                                        By partaking in this sanctified food, devotees believe they are absorbing the residual spiritual energy and favor of the God, thus purifying their body and mind, strengthening their faith, and dissolving negative karma.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Images */}
                    <div className="relative">
                        <LazyLoadImage
                            src={PaeshadImage}
                            alt="Prasad"
                            className="w-full h-auto "
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportantParshad;
