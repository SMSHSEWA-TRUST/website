import { useState, useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import teamImage from "@/assets/images/TeamMember.webp";
import { useI18n } from '@/lib/i18n';

const defaultTeamMembers = [
    { name: "Acharya Pandit Ji", role: "Chief Priest", image: teamImage },
    { name: "Acharya Pandit Ji", role: "Assistant Priest", image: teamImage },
    { name: "Acharya Ji", role: "Trust President", image: teamImage },
    { name: "Acharya Ji", role: "Trust Secretary", image: teamImage },
    { name: "Acharya Ji", role: "Trust Secretary", image: teamImage },
];

export default function Team() {
    const { t } = useI18n();

    // pull strings from translations with fallbacks
    const smallTitle = t('aboutTeam.smallTitle') || 'Lorem Ipsum odor';
    const heading = t('aboutTeam.heading') || 'Team at the Temple';
    const description = t('aboutTeam.description') || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    const arrows = t('aboutTeam.arrows') || { prev: 'Previous', next: 'Next' };
    const membersFromI18n = t('aboutTeam.members') || null;

    const teamMembers = (Array.isArray(membersFromI18n) && membersFromI18n.length > 0)
        ? membersFromI18n.map((m: any) => ({ name: m.name, role: m.role, image: teamImage }))
        : defaultTeamMembers;

    // responsive sizing: cardWidth, visibleCount and gap adapt to window width
    const [cardWidth, setCardWidth] = useState(308);
    const [visibleCount, setVisibleCount] = useState(4);
    const [gap, setGap] = useState(32);

    // compute members arrays after visibleCount is known
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

    // Update card sizing / visible count on resize (mobile adjustments)
    useEffect(() => {
        function updateSizes() {
            const w = window.innerWidth;
            if (w < 480) {
                setCardWidth(220);
                setVisibleCount(1);
                setGap(16);
            } else if (w < 768) {
                setCardWidth(260);
                setVisibleCount(2);
                setGap(20);
            } else if (w < 1024) {
                setCardWidth(280);
                setVisibleCount(3);
                setGap(24);
            } else {
                setCardWidth(308);
                setVisibleCount(4);
                setGap(32);
            }
        }
        updateSizes();
        window.addEventListener('resize', updateSizes);
        return () => window.removeEventListener('resize', updateSizes);
    }, []);

    // When visibleCount changes (responsive breakpoint), reset start index to avoid layout issues
    useEffect(() => {
        setStartIdx(visibleCount);
    }, [visibleCount]);

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
        <section className="w-full pt-6 px-4 bg-white font-secondaryFont">
            <div className="max-w-7xl mx-auto">
                {/* Dashed Border Box Heading */}
                <div className="flex justify-center mt-4">
                    <div className=" px-8 py-2 inline-block relative" >
                        <div className="text-center font-light tracking-wide textDescription mb-4  px-2" style={{ color: 'rgba(76, 41, 30, 1)' }}>
                            {smallTitle}
                        </div>
                        <h2 className="font-primaryFont textHeadingLg font-normal text-[#4c291e] text-center leading-tight tracking-wide select-none">
                            {heading}
                        </h2>
                    </div>
                </div>
                {/* Custom Divider with Dots */}
                <div className="flex items-center justify-center py-2 w-full">
                    <div className="flex items-center w-full max-w-md">
                        {/* Left arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                        </div>

                        {/* Center dots with continuous line: small-small-big-small-small */}
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', borderColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', borderColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', borderColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', borderColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', borderColor: 'rgba(139, 0, 0, 1)' }}></div>
                        </div>

                        {/* Right arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                        </div>
                    </div>
                </div>


                {/* Description */}
                <p className="font-secondaryFont text-gray-700 text-center textDescription  font-light mb-7" style={{ lineHeight: "1.6" }}>
                    {description}
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
                                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col "
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
                                    <h3 className="font-primaryFont textDescription  font-semibold text-[#4c291e] mb-1 text-left">
                                        {member.name}
                                    </h3>
                                    <p className="font-secondaryFont textDescription  text-gray-500 text-left mt-0">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Arrows */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            className="font-secondaryFont bg-red-700 hover:bg-red-800 text-white  w-10 h-10 flex items-center justify-center text-2xl font-bold shadow transition-colors duration-200"
                            onClick={prev}
                            aria-label={arrows.prev}
                            title={arrows.prev}
                        >
                            &#8592;
                        </button>
                        <button
                            className="font-secondaryFont bg-red-700 hover:bg-red-800 text-white  w-10 h-10 flex items-center justify-center text-2xl font-bold shadow transition-colors duration-200"
                            onClick={next}
                            aria-label={arrows.next}
                            title={arrows.next}
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
