
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import pujaImageWebp from '@/assets/images/pujaImage.webp';

const pujaData = [
    { title: "Puja 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ", image: pujaImageWebp, cta: "CTA Button" },
    { title: "Puja 2", description: "Lorem ipsum dolor sit amet...", image: pujaImageWebp, cta: "CTA Button" },
    { title: "Puja 3", description: "Lorem ipsum dolor sit amet...", image: pujaImageWebp, cta: "CTA Button" },
    { title: "Puja 4", description: "Lorem ipsum dolor sit amet...", image: pujaImageWebp, cta: "CTA Button" },
];

// The slide-up animation for the *incoming* card body
const bodyVariants = {
    initial: { y: "100%", opacity: 1, filter: "blur(10px)" },
    animate: { y: "0%", opacity: 1, filter: "blur(0px)", transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
    exit: { y: "0%", opacity: 1, filter: "blur(0px)", transition: { duration: 0 } }, // keep the covered card visible, no exit animation
};

export default function Puja() {
    const [shown, setShown] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [inView, setInView] = useState(false);
    const [scrollDir, setScrollDir] = useState<'down' | 'up'>('down');
    const sectionRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

    // Detect scroll direction
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current) {
                setScrollDir('down');
            } else if (currentY < lastScrollY.current) {
                setScrollDir('up');
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer to detect when section is in viewport
    useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                } else {
                    setInView(false);
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    // Animation logic for down and up scroll
    useEffect(() => {
        if (inView) {
            if (scrollDir === 'down' && shown < pujaData.length - 1) {
                const timer = setTimeout(() => {
                    setPrev(shown);
                    setShown(shown + 1);
                }, 1800);
                return () => clearTimeout(timer);
            }
            if (scrollDir === 'up' && shown > 0) {
                const timer = setTimeout(() => {
                    setPrev(shown);
                    setShown(shown - 1);
                }, 1800);
                return () => clearTimeout(timer);
            }
        }
    }, [shown, inView, scrollDir]);

    useEffect(() => {
        if (prev !== null) {
            const timer = setTimeout(() => setPrev(null), 1200);
            return () => clearTimeout(timer);
        }
    }, [prev]);

    return (
        <div className="lg:min-h-screen bg-white flex flex-col items-center py-8 font-secondaryFont" ref={sectionRef}>
            <h2 className="font-primaryFont text-[28px] text-[#B91C1C] text-center mb-2">Puja's at Temple</h2>
            <div className="flex items-center justify-center pb-4 w-full">
                <div className="flex items-center w-full max-w-md">
                    {/* Left arrow/diamond with connecting line */}
                    <div className="flex items-center flex-1">
                        <div className="w-2 h-2 bg-secondaryColor transform rotate-45"></div>
                        <div className="flex-1 h-px bg-secondaryColor"></div>
                    </div>

                    {/* Center dots with continuous line: small-small-big-small-small */}
                    <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-secondaryColor rounded-full"></div>
                        <div className="w-1.5 h-px bg-secondaryColor"></div>
                        <div className="w-1.5 h-1.5 bg-secondaryColor rounded-full"></div>
                        <div className="w-1.5 h-px bg-secondaryColor"></div>
                        <div className="w-3 h-3 bg-secondaryColor rounded-full"></div>
                        <div className="w-1.5 h-px bg-secondaryColor"></div>
                        <div className="w-1.5 h-1.5 bg-secondaryColor rounded-full"></div>
                        <div className="w-1.5 h-px bg-secondaryColor"></div>
                        <div className="w-1.5 h-1.5 bg-secondaryColor rounded-full"></div>
                    </div>

                    {/* Right arrow/diamond with connecting line */}
                    <div className="flex items-center flex-1">
                        <div className="flex-1 h-px bg-secondaryColor"></div>
                        <div className="w-2 h-2 bg-secondaryColor transform rotate-45"></div>
                    </div>
                </div>
            </div>
            <div className="relative w-full mx-auto flex flex-col items-stretch lg:min-h-[520px] md:min-h-[400px]">
                {pujaData.map((puja, idx) => {
                    if (idx > shown) return null;
                    // Remove extra space below last card
                    const isLastCard = idx === shown && idx === pujaData.length - 1;
                    return (
                        <div key={puja.title} className="w-full" style={{ zIndex: idx + 1, position: "relative", marginBottom: isLastCard ? 0 : 16 }}>
                            {/* Header always visible, stacked */}
                            <div
                                className={`bg-[#7B1313] text-white py-2 font-serif text-lg flex items-center justify-center px-4
                                                    shadow-sm
                                                `}
                                style={{
                                    position: "relative",
                                    marginTop: idx === 0 ? 0 : -12,
                                    borderTopLeftRadius: "0",
                                    borderTopRightRadius: "0",
                                    borderBottomLeftRadius: "0",
                                    borderBottomRightRadius: "0",
                                    boxShadow: idx === shown ? "0 4px 12px rgba(185,28,28,0.13)" : "0 2px 4px rgba(0,0,0,0.03)",
                                    zIndex: 30 + idx,
                                    userSelect: "none",
                                    maxHeight: "610px"
                                }}
                            >
                                <span className="font-primaryFont w-full text-center">{puja.title}</span>
                            </div>
                            {/* Only active card or previous during animation shows body */}
                            {(idx === shown || (idx === prev && prev !== null)) && (
                                <div
                                    className="relative w-full"
                                    style={{
                                        minHeight: "auto",
                                        height: "auto",
                                    }}
                                >
                                    {/* Previous card body (static, underneath) */}
                                    {idx === prev && prev !== null && (
                                        <div className="absolute left-0 right-0 top-0 w-full"
                                            style={{
                                                zIndex: 5,
                                                borderBottomLeftRadius: "0",
                                                borderBottomRightRadius: "0",
                                                boxShadow: "0 12px 32px rgba(185,28,28,0.09)",
                                                background: "#fff"
                                            }}>
                                            <div className="w-full aspect-[16/7] bg-black relative flex items-center justify-center overflow-hidden">
                                                <LazyLoadImage
                                                    src={puja.image}
                                                    alt={puja.title}
                                                    className="w-full h-full object-cover object-center"
                                                    style={{ opacity: 0.7 }}
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-6 w-full">
                                                    <div className="w-full max-w-[793px] flex flex-col items-start">
                                                        <p className="font-secondaryFont text-white text-xs md:text-base font-light mb-3 bg-black/60 px-4 py-2 rounded w-full">
                                                            {puja.description}
                                                        </p>
                                                        <button className="font-secondaryFont bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-xs font-semibold shadow transition-colors duration-200 self-start">
                                                            {puja.cta}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Current card body (animated, above) */}
                                    {idx === shown && (
                                        <AnimatePresence>
                                            <motion.div
                                                key={puja.title}
                                                variants={bodyVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                className="absolute left-0 right-0 top-0 w-full"
                                                style={{
                                                    zIndex: 10,
                                                    borderBottomLeftRadius: "0",
                                                    borderBottomRightRadius: "0",
                                                    boxShadow: "0 16px 48px rgba(185,28,28,0.13)",
                                                    background: "#fff"
                                                }}
                                            >
                                                <div className="w-full aspect-[16/7] bg-black relative flex items-center justify-center overflow-hidden">
                                                    <LazyLoadImage
                                                        src={puja.image}
                                                        alt={puja.title}
                                                        className="w-full h-full object-cover object-center"
                                                        style={{ opacity: 0.7 }}
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-6 w-full">
                                                        <div className="w-full max-w-[793px] flex flex-col items-start">
                                                            <p className="font-secondaryFont text-white text-xs md:text-base font-light mb-3 bg-black/60 px-4 py-2 rounded w-full">
                                                                {puja.description}
                                                            </p>
                                                            <button className="font-secondaryFont bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-xs font-semibold shadow transition-colors duration-200 self-start">
                                                                {puja.cta}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
