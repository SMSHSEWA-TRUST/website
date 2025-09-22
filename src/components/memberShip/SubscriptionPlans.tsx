import React, { useState } from "react";
import { useI18n } from '@/lib/i18n';


const SubscriptionPlans: React.FC = () => {
    const { t } = useI18n();

    const plans = [
        {
            id: "three_months",
            title: "3 Months",
            priceMonthly: "₹2100",
            priceAnnually: "billed every 3 Months",
            subtitle: "billed every 3 Months",
            tagline: "",
            features: [
                "Monthly Prasad delivery to your home",
                "Inclusion in monthly special pujas & aarti sankalp",
                "Exclusive festival reminders and rituals guide",
                "Access to digital newsletters with temple updates and spiritual content",
            ],
            buttonText: "Get Started",
        },
        {
            id: "six_months",
            title: "6 Months",
            priceMonthly: "₹3100",
            priceAnnually: "billed every 6 Months",
            subtitle: "billed every 6 Months",
            tagline: "",
            features: [
                "All benefits of the 3-month plan",
                "Bi-monthly Special hamper of temple offerings",
                "Priority sankalp (name inclusion) in major rituals",
                "Access to devotional audio recordings (chants, bhajans, mantras)",
            ],
            buttonText: "Get Started",
        },
        {
            id: "twelve_months",
            title: "12 Months",
            priceMonthly: "₹5100",
            priceAnnually: "billed annually",
            subtitle: "billed annually",
            tagline: "",
            features: [
                "All benefits of the 6-month plan",
                "Monthly premium Prasad delivery with festive additions",
                "Exclusive family sankalp inclusion in yearly temple yagna/maha aarti",
                "Annual personalized blessings letter from the temple priest",
                "Complimentary temple calendar & spiritual guidebook delivered once a year",
            ],
            buttonText: "Get Started",
        },
    ];

    // Default select the 12-month plan (index 2)
    const [selectedIndex, setSelectedIndex] = useState<number>(2);
    // The billing toggle was removed in the new design; keep a simple flag if needed later
    // (currently not used) - removed setState to avoid unused variable lint warnings

    return (
        <section className="py-16 px-4 bg-[#F8F5F0] mt-10 lg:mt-16">
            <div className="max-w-7xl mx-auto">

                {/* Title */}
                <div className="text-center mb-8 font-secondaryFont">
                    <h1 className="font-primaryFont text-3xl text-secondaryColor mb-4">{t('MembershipPage.title')}</h1>

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
                {/* <div className="flex justify-center mb-12">
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
                </div> */}

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch bg-[#F8F5F0] rounded-md  ">
                    {plans.map((plan, idx) => {
                        const selected = idx === selectedIndex;

                        return (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedIndex(idx)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedIndex(idx); }}
                                className={`relative rounded-xl p-6 cursor-pointer transition-all duration-200 flex flex-col h-full ${selected
                                    ? 'bg-[#8B0000] text-white shadow-2xl transform -translate-y-2'
                                    : 'bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1'
                                    }`}
                            >
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`textHeadingLg font-semibold tracking-wider ${selected ? 'text-white' : 'text-gray-900'}`}>
                                                {plan.title}
                                            </h3>
                                            {/* discount not used for these plans */}
                                        </div>

                                        {/* Title divider - a thin line under the title that changes color when selected */}
                                        <div className={`w-full h-[1px] my-3 bg-[#D05E2D]`}></div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-1">
                                        <div className="flex items-baseline">
                                            <span className={`textHeading font-bold ${selected ? 'text-white' : '#000000'}`}>
                                                {plan.priceMonthly}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtitle */}
                                    <p className={`text-sm mb-6 ${selected ? 'text-white/90' : '#000000'}`}>
                                        {plan.subtitle}
                                    </p>

                                    {/* Tagline */}
                                    <p className={`text-md font-medium mb-6 ${selected ? 'text-white' : '#000000'}`}>
                                        {plan.tagline}
                                    </p>

                                    {/* Features */}
                                    <div className="mb-3">
                                        <h4 className={`text-md font-bold mb-2 ${selected ? 'text-white' : 'text-gray-800'}`}>
                                            {"What's Included"}
                                        </h4>
                                    </div>
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
                                </div>

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