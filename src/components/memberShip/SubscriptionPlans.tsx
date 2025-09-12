import React, { useState } from "react";

const SubscriptionPlans: React.FC = () => {
    const plans = [
        {
            id: "free",
            title: "FREE",
            priceMonthly: "$0",
            priceAnnually: "$0",
            subtitle: "per user/month, billed annually",
            tagline: "For Small Teams",
            features: [
                "Real-time contact syncing",
                "Automatic data enrichment",
                "Up to 3 seats",
                "Up to 3 seats" // Duplicate as shown in image
            ],
            buttonText: "Get Started",
        },
        {
            id: "basic",
            title: "BASIC",
            priceMonthly: "$39",
            priceAnnually: "$39",
            subtitle: "per user/month, billed annually",
            discount: "-15%",
            tagline: "For Growing Teams",
            features: [
                "Private lists",
                "Enhanced email sending",
                "No seat limits",
                "Up to 3 seats"
            ],
            buttonText: "Get Started",
        },
        {
            id: "pro",
            title: "PRO",
            priceMonthly: "$59",
            priceAnnually: "$59",
            subtitle: "per user/month, billed annually",
            discount: "-15%",
            tagline: "For Scaling Businesses",
            features: [
                "Fully adjustable permissions",
                "Advanced data enrichment",
                "Priority support",
                "Up to 3 seats"
            ],
            buttonText: "Get Started",
        },
        {
            id: "enterprise",
            title: "ENTERPRISE",
            priceMonthly: "$129",
            priceAnnually: "$129",
            subtitle: "per user/month, billed annually",
            tagline: "For Big Corporation",
            features: [
                "Unlimited reporting",
                "SAML and SSO",
                "Custom billing",
                "Up to 3 seats"
            ],
            buttonText: "Contact Our Sales",
        },
    ];

    const [selectedIndex, setSelectedIndex] = useState<number>(2); // Pro selected by default
    const [billingAnnual, setBillingAnnual] = useState<boolean>(true); // Billed Annually selected

    return (
        <section className="py-16 px-4 bg-[#F8F5F0">
            <div className="max-w-7xl mx-auto">

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

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex rounded-lg bg-white shadow-sm border border-gray-200" role="group" aria-label="Billing toggle">
                        <button
                            onClick={() => setBillingAnnual(false)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setBillingAnnual(false); }}
                            aria-pressed={!billingAnnual}
                            className={`px-6 py-2.5 font-SecondaryFont textDescription  rounded-md transition-colors ${!billingAnnual
                                ? 'bg-[#8B0000] text-[#FFFFFF]'
                                : 'bg-white text-[#000000]'
                                }`}
                        >
                            Billed Monthly
                        </button>
                        <button
                            onClick={() => setBillingAnnual(true)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setBillingAnnual(true); }}
                            aria-pressed={billingAnnual}
                            className={`px-6 py-2.5 font-SecondaryFont textDescription  rounded-md transition-colors ${billingAnnual
                                ? 'bg-[#8B0000] text-[#FFFFFF]'
                                : 'bg-white text-[#000000]'
                                }`}
                        >
                            Billed Annually
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan, idx) => {
                        const selected = idx === selectedIndex;

                        return (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedIndex(idx)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedIndex(idx); }}
                                className={`relative rounded-xl p-6 cursor-pointer transition-all duration-200 ${selected
                                    ? 'bg-[#8B0000] text-white shadow-2xl transform -translate-y-2'
                                    : 'bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1'
                                    }`}
                            >
                                {/* Header */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-sm font-semibold tracking-wider ${selected ? 'text-white' : 'text-gray-900'}`}>
                                            {plan.title}
                                        </h3>
                                        {plan.discount && (
                                            <span className={`text-xs px-2 py-0.5  font-medium ${selected
                                                ? 'bg-white/20 text-white'
                                                : 'bg-[white] text-[#000000]'
                                                }`}>
                                                {plan.discount}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-1">
                                    <div className="flex items-baseline">
                                        <span className={`text-4xl font-bold ${selected ? 'text-white' : '#000000'}`}>
                                            {billingAnnual ? plan.priceAnnually : plan.priceMonthly}
                                        </span>
                                    </div>
                                </div>

                                {/* Subtitle */}
                                <p className={`text-xs mb-6 ${selected ? 'text-white/90' : '#000000'}`}>
                                    {plan.subtitle}
                                </p>

                                {/* Tagline */}
                                <p className={`text-sm font-medium mb-6 ${selected ? 'text-white' : '#000000'}`}>
                                    {plan.tagline}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <svg
                                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selected ? 'text-white' : 'text-gray-400'}`}
                                                fill="none"
                                                viewBox="0 0 16 16"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M13.5 4.5L6 12L2.5 8.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className={`text-sm ${selected ? 'text-white/90' : '#000000'}`}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Button */}
                                <button className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${selected
                                    ? 'bg-white text-red-800 hover:bg-gray-50'
                                    : plan.id === 'enterprise'
                                        ? 'bg-white border-2 border-red-700 text-red-700 hover:bg-red-50'
                                        : 'bg-white border-2 border-red-700 text-red-700 hover:bg-red-50'
                                    }`}>
                                    {plan.buttonText}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SubscriptionPlans;