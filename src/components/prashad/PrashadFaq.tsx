import React, { useState } from 'react';

type FaqItem = {
    question: string;
    answer: string;
};

const PRASHAD_FAQ: FaqItem[] = [
    {
        question: 'What exactly is prashad?',
        answer:
            'Prashad (or Prasad) is a sacred vegetarian food offering that has been blessed by a deity during a special puja or ceremony. When you receive it, you are partaking in the blessings and spiritual energy of the Divine.',
    },
    {
        question: 'Is the prashad safe to eat?',
        answer:
            'Yes. Prashad is prepared following traditional practices and basic food-safety standards. If you have specific health concerns, please check ingredient details or contact us before ordering.',
    },
    {
        question: 'What ingredients are used in the prashad?',
        answer:
            'Ingredients vary by item. We aim to use simple, vegetarian ingredients; specific ingredient lists are available on each product page. If you have allergies, please review the product information carefully.',
    },
    {
        question: 'How long will it take for my prashad order to arrive?',
        answer:
            'Delivery times depend on your location and the selected shipping method. Estimated delivery windows are shown during checkout and in your order confirmation email.',
    },
    {
        question: 'How should I store the prashad once it arrives?',
        answer:
            'Storage instructions depend on the product. Many prashad items are best kept in a cool, dry place and consumed within the recommended timeframe. Check the product details for specific storage guidance.',
    },
    {
        question: 'Can I order prashad for someone else as a gift?',
        answer:
            'Yes — you can have prashad delivered to another person. Provide the recipient’s delivery details at checkout and include a gift message if desired.',
    },
    {
        question: 'What if I have allergies? How can I be sure the prashad is safe for me?',
        answer:
            'Please check the ingredient list on the product page and contact us if you have specific allergy concerns. We cannot guarantee the absence of cross-contamination in all cases.',
    },
    {
        question: 'What is your policy on cancellations, returns, and refunds?',
        answer:
            'Because prashad is a perishable and sacred food item, cancellations and returns are handled case-by-case. Please review our terms or contact customer support for assistance with an order.',
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

const PrashadFaq: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (idx: number) => {
        setOpenIndex(prev => (prev === idx ? null : idx));
    };

    return (
        <section className="lg:py-12 px-4 md:px-8 lg:px-0">
            <div className="max-w-[1080px] mx-auto">
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-primaryFont text-[#8b0000] inline-block border-b-[4px] border-[#D05E2D] pb-2">
                        Prashad Related FAQ's
                    </h2>
                </div>

                <div className="space-y-4">
                    {PRASHAD_FAQ.map((item, idx) => {
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
