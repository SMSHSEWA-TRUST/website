import React, { useEffect, useState } from 'react';
import TrusteeImg from '../../assets/images/TeamMember.webp';

const trustees = [
    {
        id: 1,
        name: 'John Doe',
        position: 'Chairperson',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        image: TrusteeImg,
    },
    {
        id: 2,
        name: 'Jane Smith',
        position: 'Trustee',
        text: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`,
        image: TrusteeImg,
    },
    {
        id: 3,
        name: 'Ravi Kumar',
        position: 'Secretary',
        text: `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.`,
        image: TrusteeImg,
    },
];

const WordsTrustees: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [activeButton, setActiveButton] = useState<'prev' | 'next' | null>(null);

    const next = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveButton('next');
        setCurrent((p) => (p + 1) % trustees.length);
        setTimeout(() => {
            setIsTransitioning(false);
            setActiveButton(null);
        }, 300);
    };

    const prev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveButton('prev');
        setCurrent((p) => (p - 1 + trustees.length) % trustees.length);
        setTimeout(() => {
            setIsTransitioning(false);
            setActiveButton(null);
        }, 300);
    };

    const item = trustees[current];

    useEffect(() => {
        // Optional: auto-advance every 8s (kept commented for now)
        // const id = setInterval(() => next(), 8000);
        // return () => clearInterval(id);
    }, []);

    return (
        <section className="w-full px-4 md:px-16 lg:px-24 py-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left panel: text on a warm beige background */}
                <div className="w-full order-2 lg:order-1 lg:pl-6 lg:pr-28">
                    <h2 className="font-serif text-2xl lg:text-3xl text-[#3b2f2a] tracking-wide mb-4">
                        Words from the Trustee’s
                    </h2>

                    <p className="text-sm lg:text-base text-[#6b6764] leading-7 mb-6">
                        {item.text}
                    </p>

                    {/* Decorative line after paragraph */}
                    <div className="w-full flex justify-start mb-3">
                        <div className="flex items-center w-[60%]">
                            <span className="flex-1 h-[2px] bg-[#e07a4c] rounded"></span>
                        </div>
                    </div>

                    <div className="border-[#e7ddd6] pt-6 flex items-center justify-between">
                        <div>
                            <div className="text-[#8a1d1d] font-semibold text-lg">{item.name}</div>
                            <div className="text-sm text-[#9b9b9b]">{item.position}</div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={prev}
                                disabled={isTransitioning}
                                aria-label="previous trustee"
                                className={`w-9 h-9 flex items-center justify-center rounded-sm border border-[#7c0a02] transition-all duration-200 disabled:opacity-50 transform
                                    ${activeButton === 'prev'
                                        ? 'bg-[rgba(139,0,0,1)] text-white scale-95 shadow-inner'
                                        : 'bg-white text-[#7c0a02] hover:bg-[rgba(139,0,0,1)] hover:text-white active:scale-95 active:shadow-inner'
                                    }`}
                            >
                                ←
                            </button>

                            <button
                                onClick={next}
                                disabled={isTransitioning}
                                aria-label="next trustee"
                                className={`w-9 h-9 flex items-center justify-center rounded-sm border border-[#7c0a02] transition-all duration-200 disabled:opacity-50 transform
                                    ${activeButton === 'next'
                                        ? 'bg-[rgba(139,0,0,1)] text-white scale-95 shadow-inner'
                                        : 'bg-white text-[#7c0a02] hover:bg-[rgba(139,0,0,1)] hover:text-white active:scale-95 active:shadow-inner'
                                    }`}
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right panel: image */}
                <div className="w-full order-1 lg:order-2 flex items-center justify-center">
                    <div className={`w-full max-w-[640px] transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                        <img
                            key={item.id}
                            src={item.image}
                            alt={`Trustee ${item.name}`}
                            className={`w-full h-auto object-cover rounded-md transition-transform duration-300 ${isTransitioning ? 'scale-95' : 'scale-100'}`}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WordsTrustees;
