import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

type FaqItem = {
    question: string;
    answer: string;
};

const Chevron: React.FC<{ open: boolean; colorClass?: string }> = ({ open, colorClass }) => (
    <svg
        className={`w-5 h-5 transform transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'} ${colorClass ?? 'text-gray-500'}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const Faq: React.FC = () => {
    const { t } = useI18n();
    const [openIndex, setOpenIndex] = useState<number | null>(null); // No item open by default

    const toggle = (idx: number) => {
        setOpenIndex(prev => (prev === idx ? null : idx));
    };

    const faqItems: FaqItem[] = t('membershipFaq.items') || [];
    const heading = t('membershipFaq.heading') || 'Frequently Asked Questions';
    // console.log(faqItems)
    // return <></>
    return (
        <section className="lg:py-12 px-4 md:px-8 lg:px-0 ">
            <div className="max-w-[1080px] mx-auto">
                <h2 className="text-center font-primaryFont textHeadingLg text-[#8B0000] tracking-wide mb-10">
                    {heading}
                </h2>

                <div className="space-y-4">
                    {faqItems.map((item, idx) => {
                        const isOpen = idx === openIndex;
                        return (
                            <div
                                key={idx}
                                className={`rounded-md bg-[#FFFFFF] overflow-hidden transition-all duration-300 hover:shadow-md ${isOpen ? 'border-[1px] border-[#8B0000]' : 'border-[1px] border-[#E4E4E4]'}`}
                            >
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-panel-${idx}`}
                                    onClick={() => toggle(idx)}
                                    className={`w-full text-left flex items-center justify-between p-6 focus:ring-inset transition-colors duration-200 ${isOpen ? '[#8B0000]' : ''}`}
                                >
                                    <h3 className={`font-primaryFont textHeading transition-colors duration-200 ${isOpen ? 'text-[#8B0000]' : 'text-[#000000]'}`}>
                                        {item.question}
                                    </h3>

                                    <div className={`flex-shrink-0 transition-colors duration-200`}>
                                        <Chevron open={isOpen} colorClass={isOpen ? 'text-[#8B0000]' : 'text-gray-500'} />
                                    </div>
                                </button>

                                <div
                                    id={`faq-panel-${idx}`}
                                    role="region"
                                    aria-labelledby={`faq-button-${idx}`}
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6">
                                        <p className="text-[#727272] leading-relaxed textDescription">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Faq;