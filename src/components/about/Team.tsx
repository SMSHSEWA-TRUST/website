import { useState, useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import teamImage from "@/assets/images/TeamMember.webp";
const teamMembers = [
    { name: "Acharya Pandit Ji", role: "Chief Priest", image: teamImage },
    { name: "Acharya Pandit Ji", role: "Assistant Priest", image: teamImage },
    { name: "Acharya Ji", role: "Trust President", image: teamImage },
    { name: "Acharya Ji", role: "Trust Secretary", image: teamImage },
    { name: "Acharya Ji", role: "Trust Secretary", image: teamImage },
];

export default function Team() {
    const visibleCount = 4;
    const cardWidth = 308; // matches your blue selection box
    const gap = 32; // gap between cards
    // Repeat enough to look infinite
    const baseMembers = Array(6).fill(teamMembers).flat();
    const allMembers = [
        ...baseMembers.slice(-visibleCount),
        ...baseMembers,
        ...baseMembers.slice(0, visibleCount)
    ];

    const [startIdx, setStartIdx] = useState(visibleCount);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [noTransition, setNoTransition] = useState(false);

    // Infinite scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isTransitioning) return;
        const handle = setTimeout(() => {
            // Reset position instantly if at the duplicate ends
            if (startIdx >= allMembers.length - visibleCount) {
                setNoTransition(true);
                setStartIdx(visibleCount);
                setTimeout(() => setNoTransition(false), 20);
            } else if (startIdx <= 0) {
                setNoTransition(true);
                setStartIdx(allMembers.length - visibleCount * 2);
                setTimeout(() => setNoTransition(false), 20);
            } else {
                setIsTransitioning(false);
            }
        }, 480); // Must match CSS transition duration
        return () => clearTimeout(handle);
    }, [startIdx, isTransitioning, allMembers.length, visibleCount]);

    const transitionClass = noTransition
        ? 'transition-none'
        : 'transition-transform duration-[480ms] ease-in-out';

    // Handlers
    const next = () => {
        setIsTransitioning(true);
        setNoTransition(false);
        setStartIdx((prev) => prev + 1);
    };
    const prev = () => {
        setIsTransitioning(true);
        setNoTransition(false);
        setStartIdx((prev) => prev - 1);
    };

    return (
        <section className="w-full py-6 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Dashed Border Box Heading */}
                <div className="flex justify-center mt-4">
                    <div className=" px-8 py-2 inline-block relative" style={{ minWidth: 510 }}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-light tracking-wide bg-white px-2">
                            Lorem Ipsum odor
                        </div>
                        <h2 className="text-[36px] font-serif font-normal text-[#4c291e] text-center leading-tight tracking-wide select-none">
                            Team at the Temple
                        </h2>
                    </div>
                </div>
                {/* Custom Divider with Dots */}
                <div className="flex items-center justify-center py-8">
                    <div className="flex items-center">
                        {/* Left arrow/diamond with connecting line */}
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 transform rotate-45"></div>
                            <div className="w-16 h-px bg-orange-500"></div>
                        </div>

                        {/* Center dots with continuous line: small-small-big-small-small */}
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-4 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-4 h-px bg-orange-500"></div>
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div className="w-4 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-4 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        </div>

                        {/* Right arrow/diamond with connecting line */}
                        <div className="flex items-center">
                            <div className="w-16 h-px bg-orange-500"></div>
                            <div className="w-3 h-3 bg-orange-500 transform rotate-45"></div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 max-w-3xl mx-auto text-center text-[15px] font-light mb-7" style={{ lineHeight: "1.6" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                {/* Carousel */}
                <div className="relative">
                    <div
                        className={`flex gap-8 ${transitionClass}`}
                        style={{
                            transform: `translateX(-${startIdx * (cardWidth + gap)}px)`,
                            willChange: "transform",
                        }}
                    >
                        {allMembers.map((member, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                                style={{
                                    minWidth: cardWidth,
                                    maxWidth: cardWidth,
                                    borderRadius: 16,
                                    boxShadow: "0px 5px 16px 0px rgba(0,0,0,0.08)",
                                }}
                            >
                                <div
                                    className="w-full bg-gray-100"
                                    style={{
                                        aspectRatio: "308/291",
                                        borderBottom: "1px solid #eaeaea"
                                    }}
                                >
                                    <LazyLoadImage
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="px-6 py-3 pb-2">
                                    <h3 className="text-[20px] font-semibold text-[#4c291e] mb-1 text-left font-serif">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 text-left mt-0">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Arrows */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            className="bg-red-700 hover:bg-red-800 text-white  w-10 h-10 flex items-center justify-center text-2xl font-bold shadow transition-colors duration-200"
                            onClick={prev}
                            aria-label="Previous"
                        >
                            &#8592;
                        </button>
                        <button
                            className="bg-red-700 hover:bg-red-800 text-white  w-10 h-10 flex items-center justify-center text-2xl font-bold shadow transition-colors duration-200"
                            onClick={next}
                            aria-label="Next"
                        >
                            &#8594;
                        </button>
                    </div>
                </div>
            </div>
            {/* Extra bottom margin */}
            <div style={{ height: 40 }} />
        </section>
    );
}
