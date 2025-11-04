import { useState, useEffect, useRef } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import teamImage from "@/assets/images/TeamMember.webp";
import { useI18n } from '@/lib/i18n';
import { useGetTeam } from '@/api/TeamQueries';

const defaultTeamMembers = [
    { name: "Abhinavan Subramanian", role: "Position Holding", image: teamImage, description: '', email: '', phone: '', linkedIn: null },
    { name: "Abhinavan Subramanian", role: "Position Holding", image: teamImage, description: '', email: '', phone: '', linkedIn: null },
    { name: "Abhinavan Subramanian", role: "Position Holding", image: teamImage, description: '', email: '', phone: '', linkedIn: null },
    { name: "Abhinavan Subramanian", role: "Position Holding", image: teamImage, description: '', email: '', phone: '', linkedIn: null },
    { name: "Abhinavan Subramanian", role: "Position Holding", image: teamImage, description: '', email: '', phone: '', linkedIn: null },
];

export default function Team() {
    const { t } = useI18n();
    const { data, isLoading, error } = useGetTeam();

    // pull strings from translations with fallbacks
    const smallTitle = t('aboutTeam.smallTitle') || 'Lorem Ipsum odor';
    const heading = t('aboutTeam.heading') || 'Team at the Temple';
    const description = t('aboutTeam.description') || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    const arrows = t('aboutTeam.arrows') || { prev: 'Previous', next: 'Next' };
    const membersFromI18n = t('aboutTeam.members') || null;

    const apiMembers = data?.data || [];
    const teamMembers = apiMembers.length > 0
        ? apiMembers.map((m: any) => ({
            name: m.name,
            role: m.role,
            image: m.imageUrl, // No fallback - will be null if imageUrl is null
            description: m.description || '',
            email: m.email || '',
            phone: m.phone || '',
            linkedIn: m.linkedIn || null,
            _id: m._id
        }))
        : (Array.isArray(membersFromI18n) && membersFromI18n.length > 0)
            ? membersFromI18n.map((m: any) => ({ name: m.name, role: m.role, image: teamImage, description: '', email: '', phone: '', linkedIn: null }))
            : defaultTeamMembers.map(m => ({ ...m, description: '', email: '', phone: '', linkedIn: null }));

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
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [noTransition, setNoTransition] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // Infinite scroll effect
    useEffect(() => {
        if (teamMembers.length === 0) return;
        const interval = setInterval(() => {
            next();
        }, 2000);
        return () => clearInterval(interval);
    }, [teamMembers.length]);

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

    // Modal handlers
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setSelectedMember(null);
        }
        if (selectedMember) {
            document.addEventListener('keydown', onKey);
            // lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [selectedMember]);

    const openMember = (member: any) => {
        setSelectedMember(member);
    };
    const closeMember = () => setSelectedMember(null);

    const onOverlayClick = (e: React.MouseEvent) => {
        if (e.target === containerRef.current) {
            setSelectedMember(null);
        }
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
                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading team members...</p>
                        </div>
                    </div>
                )}
                {/* Error State */}
                {error && (
                    <div className="text-center py-10">
                        <p className="text-red-600">Failed to load team members. Please try again later.</p>
                    </div>
                )}
                {/* Carousel */}
                {!isLoading && !error && (
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
                                    onClick={() => openMember(member)}
                                >
                                    <div
                                        className="w-full bg-gray-100 flex items-center justify-center"
                                        style={{
                                            aspectRatio: "308/291",
                                            borderBottom: "1px solid #eaeaea"
                                        }}
                                    >
                                        {member.image ? (
                                            <LazyLoadImage
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-xs text-center px-2">No Image</span>
                                            </div>
                                        )}
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
                        <div className="flex justify-center gap-2 mt-6">
                            <button
                                className="font-secondaryFont w-8 h-8 flex items-center justify-center rounded border border-[#7c0a02] transition-all duration-200 transform bg-white text-[#7c0a02] hover:bg-[rgba(139,0,0,1)] hover:text-white active:scale-95 active:shadow-inner"
                                onClick={prev}
                                aria-label={arrows.prev}
                                title={arrows.prev}
                            >
                                <span className="text-xl">&#8592;</span>
                            </button>
                            <button
                                className="font-secondaryFont w-8 h-8 flex items-center justify-center rounded border border-[#7c0a02] transition-all duration-200 transform bg-white text-[#7c0a02] hover:bg-[rgba(139,0,0,1)] hover:text-white active:scale-95 active:shadow-inner"
                                onClick={next}
                                aria-label={arrows.next}
                                title={arrows.next}
                            >
                                <span className="text-xl">&#8594;</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Extra bottom margin */}
            <div style={{ height: 40 }} />

            {/* Modal */}
            {selectedMember && (
                <div ref={containerRef} onClick={onOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm -webkit-backdrop-blur-sm pointer-events-none"
                        aria-hidden
                    />

                    {/* Modal content */}
                    <div className="relative bg-white w-full mx-4 rounded-lg shadow-2xl max-w-[400px] sm:max-w-[640px] lg:max-w-[1134px] max-h-[90vh] overflow-auto">
                        {/* Close button */}
                        <button
                            onClick={closeMember}
                            aria-label="Close"
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-600 z-20 shadow-sm"
                        >
                            <span className="text-lg leading-none">×</span>
                        </button>

                        {/* Content Layout */}
                        <div className="flex flex-col-reverse lg:flex-row min-h-0 lg:min-h-[500px] h-full">
                            {/* Left side - Text content */}
                            <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 bg-white flex flex-col overflow-auto">
                                {/* Name */}
                                <h2 className="textHeadingLg mb-2 text-[#8B0000]" >
                                    {selectedMember.name}
                                </h2>

                                {/* Position */}
                                <p className="text-[#1E1E1E80] textDescription mb-4 lg:mb-6">
                                    {selectedMember.role}
                                </p>

                                {/* Decorative line */}
                                <div className="w-full h-0.5 bg-[#D05E2D] mb-4 lg:mb-6"></div>

                                {/* Description */}
                                <p className="text-gray-700 textDescription leading-relaxed mb-4 lg:mb-6">
                                    {selectedMember.description || 'No description available.'}
                                </p>



                                {/* Social Media Icons */}
                                {/* <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center opacity-50 cursor-not-allowed" style={{ borderColor: '#AD2F16', color: '#AD2F16' }}>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </div>

                                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center opacity-50 cursor-not-allowed" style={{ borderColor: '#AD2F16', color: '#AD2F16' }}>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </div>

                                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center opacity-50 cursor-not-allowed" style={{ borderColor: '#AD2F16', color: '#AD2F16' }}>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                            <rect x="3" y="3" width="18" height="18" rx="5" />
                                            <circle cx="12" cy="12" r="3.2" />
                                            <circle cx="17.5" cy="6.5" r="0.6" />
                                        </svg>
                                    </div>

                                    {selectedMember.linkedIn ? (
                                        <a
                                            href={selectedMember.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-red-50 cursor-pointer transition-colors duration-200"
                                            style={{ borderColor: '#AD2F16', color: '#AD2F16' }}
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </a>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center opacity-50 cursor-not-allowed" style={{ borderColor: '#AD2F16', color: '#AD2F16' }}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center opacity-50 cursor-not-allowed" style={{ borderColor: '#AD2F16', color: '#AD2F16' }}>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </div>
                                </div> */}
                            </div>

                            {/* Right side - Image (appears above text on small screens) */}
                            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
                                {/* Responsive image container that fits modal width and keeps aspect ratios */}
                                <div className="w-full h-full flex items-center justify-center">
                                    {selectedMember.image ? (
                                        <img
                                            src={selectedMember.image}
                                            alt={selectedMember.name}
                                            className="w-full object-cover object-center max-h-[300px] sm:max-h-[360px] md:max-h-[420px] lg:max-h-[508px] rounded-b-none lg:rounded-r-lg"
                                            style={{ maxWidth: '100%', display: 'block' }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-b-none lg:rounded-r-lg w-full h-full">
                                            <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm text-center px-4">No Image Available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
