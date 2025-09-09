import React, { useState } from 'react';

type FaqItem = {
    question: string;
    answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
    {
        question: 'Which pricing plan is right for me?',
        answer:
            'We understand that each organization is unique, requiring specific features to support its workflows and projects. Above you can see the features included in the different plans to support your needs. If you need help in choosing the right plan for you, reach out to our sales team.',
    },
    {
        question: 'How does our pricing work?',
        answer:
            'Our pricing is flexible and designed to scale with your organization. We provide monthly and annual plans, and discounts for yearly commitments. If you have special requirements we can create a custom quote.',
    },
    {
        question: 'What if I change my mind?',
        answer:
            'You can cancel at any time. For annual plans we offer a prorated refund policy subject to the terms listed on the pricing page.',
    },
    {
        question: 'Do you offer any discounted plans?',
        answer:
            'We offer discounts to nonprofits, educational institutions, and long-term commitments. Contact our sales team to see if you qualify.',
    },
    {
        question: 'What payment methods do you accept?',
        answer:
            'We accept major credit cards, debit cards, and bank transfers. For larger organizations we can invoice and support purchase orders.',
    },
    {
        question: 'Does Venture offer plans to nonprofits and NGOs?',
        answer:
            'Yes. We have special pricing and support programs for nonprofits and NGOs. Please reach out to our partnerships team for details.',
    },
];

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
    const [openIndex, setOpenIndex] = useState<number | null>(null); // No item open by default

    const toggle = (idx: number) => {
        setOpenIndex(prev => (prev === idx ? null : idx));
    };

    return (
        <section className="lg:py-12 px-4 md:px-8 lg:px-0 ">
            <div className="max-w-[1080px] mx-auto">
                <h2 className="text-center font-primaryFont textHeadingLg text-[#8B0000] tracking-wide mb-10">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, idx) => {
                        const isOpen = idx === openIndex;
                        return (
                            <div
                                key={idx}
                                className={`rounded-md bg-white overflow-hidden transition-all duration-300 hover:shadow-md ${isOpen ? 'border-[1px] border-[#8B0000]' : ''}`}
                            >
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-panel-${idx}`}
                                    onClick={() => toggle(idx)}
                                    className={`w-full text-left flex items-center justify-between p-6 focus:ring-inset transition-colors duration-200 ${isOpen ? '[#8B0000]' : ''}`}
                                >
                                    <h3 className={`font-primaryFont textHeading transition-colors duration-200 ${isOpen ? 'text-[#8B0000]' : 'text-gray-800'}`}>
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
                                        <p className="text-gray-600 leading-relaxed textDescription">
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