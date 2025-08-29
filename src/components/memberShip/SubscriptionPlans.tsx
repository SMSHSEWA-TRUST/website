
import React, { useState } from "react";

const SubscriptionPlans: React.FC = () => {
    const features = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ];

    // Prices / plans data (5 cards based on original layout)
    const plans = [
        { price: "₹1199" },
        { price: "₹1199" },
        { price: "₹1199" },
        { price: "₹1109" },
        { price: "₹1109" },
    ];

    const [selectedIndex, setSelectedIndex] = useState<number>(0); // first card selected by default

    const SubscriptionCard: React.FC<{
        selected?: boolean;
        price?: string;
        onClick?: () => void;
    }> = ({ selected = false, price = "₹1199", onClick }) => {
        const baseClasses = `font-secondaryFont rounded-lg p-6 w-[341px] lg:max-w-[387px] min-h-[400px] transition-shadow transition-colors duration-200 cursor-pointer overflow-hidden transform hover:-translate-y-1 hover:shadow-xl`;


        const inlineStyle: React.CSSProperties = selected
            ? {
                backgroundColor: "rgba(139,0,0,1)",
                color: "white",
                boxShadow: "0 12px 30px rgba(139,0,0,0.18)",
                border: "1px solid rgba(139,0,0,0.12)"
            }
            : {
                backgroundColor: "#ffffff",
                /* stronger but still subtle darker shadow so card separates from white background */
                boxShadow: "0 10px 30px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.06)",
                zIndex: 10
            };

        return (
            <div
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick && onClick(); }}
                className={baseClasses}
                style={inlineStyle}
            >
                {/* Plan Name */}
                <h3 className={`font-primaryFont textHeading font-medium mb-3 ${selected ? "text-white" : "text-secondaryColor"}`}>
                    Plan Name
                </h3>

                {/* Description */}
                <p className={`font-secondaryFont textDescription  mb-4 leading-relaxed ${selected ? "text-white/90" : "text-gray-600"}`}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                {/* Price */}
                <div className="mb-4">
                    <span className={`font-primaryFont textHeading  font-bold ${selected ? "text-white" : "text-red-700"}`}>
                        {price}
                    </span>
                    <span className={`font-secondaryFont textDescription  ml-1 ${selected ? "text-white/80" : "text-gray-500"}`}>
                        /month
                    </span>
                </div>

                {/* Plan Type Buttons */}
                <div className="flex gap-2 mb-4">
                    <button className={`font-secondaryFont px-3 py-1.5  textDescription  font-medium rounded bg-yellow-400 text-red-800`}>
                        Monthly
                    </button>
                    <button className={`font-secondaryFont px-3 py-1.5 textDescription  font-medium rounded ${selected
                        ? "bg-yellow-400 text-red-800"
                        : "bg-yellow-400 text-red-800"
                        }`}>
                        20% Off
                    </button>
                </div>

                {/* Buy Now Button */}
                <button className={`font-secondaryFont w-full py-2.5 rounded font-medium textDescription  mb-4 ${selected
                    ? "bg-white text-red-800 hover:bg-gray-100"
                    : "bg-red-800 text-white hover:bg-red-900"
                    }`}>
                    Buy Now
                </button>

                {/* Features List */}
                <ul className="space-y-2">
                    {features.map((feature, idx) => (
                        <li key={idx} className={`font-secondaryFont text-[12px] lg:text-[16px] leading-relaxed flex items-start ${selected ? "text-white/90" : "text-gray-600"
                            }`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0 ${selected ? "bg-white" : "bg-red-600"
                                }`}></span>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b  py-12  px-4 bg-[#F8F5F0]">
            {/* Title */}
            <div className="text-center mb-8 font-secondaryFont">
                <h1 className="font-primaryFont text-3xl text-secondaryColor mb-4">Subscription Plans</h1>

                {/* Decorative line with dots and image */}
                <div className="flex items-center justify-center py-2 w-full">
                    <div className="flex items-center w-full max-w-md">
                        {/* Left arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="w-2 h-2 transform rotate-45 bg-secondaryColor"></div>
                            <div className="flex-1 h-px bg-secondaryColor"></div>
                        </div>

                        {/* Center dots with continuous line: small-small-big-small-small */}
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                            <div className="w-1.5 h-px bg-secondaryColor"></div>
                            <div className="w-1.5 h-1.5 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                            <div className="w-1.5 h-px bg-secondaryColor"></div>
                            <div className="w-3 h-3 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                            <div className="w-1.5 h-px bg-secondaryColor"></div>
                            <div className="w-1.5 h-1.5 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                            <div className="w-1.5 h-px bg-secondaryColor"></div>
                            <div className="w-1.5 h-1.5 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                        </div>

                        {/* Right arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="flex-1 h-px bg-secondaryColor"></div>
                            <div className="w-2 h-2 transform rotate-45 bg-secondaryColor"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Container */}
            <div className="w-full mx-auto max-w-[1200px]">
                {/* Top Row - 3 Cards */}
                <div className="flex flex-wrap justify-center gap-8">
                    {plans.map((p, idx) => (
                        <SubscriptionCard
                            key={idx}
                            price={p.price}
                            selected={selectedIndex === idx}
                            onClick={() => setSelectedIndex(idx)}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SubscriptionPlans;