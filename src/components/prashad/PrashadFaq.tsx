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

const PrashadFaq: React.FC = () => {
    const { t } = useI18n();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqItems = (t('prashad.faq.items') || []) as FaqItem[];

    const toggle = (idx: number) => {
        setOpenIndex(prev => (prev === idx ? null : idx));
    };

    return (
        <section className="lg:py-12 px-4 md:px-8 lg:px-0">
            <div className="max-w-[1080px] mx-auto">
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-primaryFont text-[#8b0000] inline-block border-b-[4px] border-[#D05E2D] pb-2">
                        {t('prashad.faq.heading')}
                    </h2>
                </div>

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
                                    aria-controls={`prashad-faq-panel-${idx}`}
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
                                    id={`prashad-faq-panel-${idx}`}
                                    role="region"
                                    aria-labelledby={`prashad-faq-button-${idx}`}
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
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

export default PrashadFaq;
