
import { useState, useEffect, } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";

// Image imports
import image4 from '@/assets/images/image-4.png';
import image5Webp from '@/assets/images/image-5.webp';
import mand9Min1 from '@/assets/images/mand-9-min 1.png';
import mand9Min2 from '@/assets/images/mand-9-min 2.png';
import mand9Min3 from '@/assets/images/mand-9-min 3.png';
import mand9Min4 from '@/assets/images/mand-9-min 4.png';
import mand9Min5 from '@/assets/images/mand-9-min 5.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';


// Custom hook for counter animation
const useCountAnimation = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isVisible]);

    return { count, setIsVisible };
};

// Custom hook for intersection observer
const useIntersectionObserver = (callback: () => void, options = {}) => {
    const [ref, setRef] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    callback();
                    observer.disconnect(); // Only trigger once
                }
            },
            {
                threshold: 0.3, // Trigger when 30% of the section is visible
                ...options
            }
        );

        observer.observe(ref);

        return () => observer.disconnect();
    }, [ref, callback, options]);

    return setRef;
};

// Component for animated stat display
const AnimatedStat = ({ amount, label, shouldAnimate }: { amount: string; label: string; shouldAnimate: boolean }) => {
    // Parse amount (handle 'k' suffix)
    const numericAmount = amount.toLowerCase().includes('k')
        ? parseInt(amount.replace('k', ''))
        : parseInt(amount);

    const { count, setIsVisible } = useCountAnimation(numericAmount, 2500);

    useEffect(() => {
        if (shouldAnimate) {
            // Small delay to make the animation more noticeable
            const timer = setTimeout(() => setIsVisible(true), 200);
            return () => clearTimeout(timer);
        }
    }, [shouldAnimate, setIsVisible]);

    // Format the display value
    const displayValue = amount.toLowerCase().includes('k')
        ? `${count}k`
        : count.toString();

    return (
        <li className="flex items-center gap-3">
            <span className="text-[48px] font-marcellus  font-normal text-[rgba(76,41,30,1)]">
                {displayValue}
                <span className="text-xl md:text-3xl align-super">+</span>
            </span>
            <span className="text-[rgba(76,41,30,1)] text-[17px] lg:text-[20px] font-normal font-tenor-sans">
                {label}
            </span>
        </li>
    );
};

const donationStats = [
    { amount: "100k", label: "Lorem ipsum dolor" },
    { amount: "100k", label: "Lorem ipsum dolor" },
    { amount: "100k", label: "Lorem ipsum dolor" },
    { amount: "100k", label: "Lorem ipsum dolor" },
];


// Donation data
const donations = [
    {
        title: "Donation 1",
        description: "(What is Included, a small Description will go here)",
    },
    {
        title: "Donation 2",
        description: "(What is Included, a small Description will go here)",
    },
    {
        title: "Donation 3",
        description: "(What is Included, a small Description will go here)",
    },
    {
        title: "Custom Donation",
        description: "(What is Included, a small Description will go here)",
    },
];


export default function DonationSection() {
    const [shouldStartAnimation, setShouldStartAnimation] = useState(false);

    const setRef = useIntersectionObserver(() => {
        setShouldStartAnimation(true);
    });

    return (
        <section ref={setRef} className="w-full bg-[#f7f3ef] py-16 px-4 md:px-0">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Stats */}
                <div className="flex flex-col gap-8">
                    <p className="text-[rgba(76,41,30,1)] font-marcellus text-[17px] lg:text-[20px] max-w-xs mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing eli
                    </p>
                    <ul className="flex flex-col gap-6">
                        {donationStats.map((stat, idx) => (
                            <AnimatedStat
                                key={idx}
                                amount={stat.amount}
                                label={stat.label}
                                shouldAnimate={shouldStartAnimation}
                            />
                        ))}
                    </ul>
                </div>

                {/* Right: Main Content */}
                <div className="flex flex-col items-start gap-6 w-full">
                    <h2 className="text-[rgba(76, 41, 30, 1)] text-[26px] lg:text-[36px] font-marcellus font-normal leading-tight mb-2">
                        Lorem ipsum dolor sit amet, <br className="hidden md:block" />
                        consectetur adipiscing eli
                    </h2>
                    {/* Decorative line with diamond ends */}
                    <div className="w-full flex justify-start mb-2">
                        <div className="flex items-center w-[80%] ">
                            <span className="w-2 h-2 bg-[#e07a4c] rotate-45 block" style={{ borderRadius: '2px' }}></span>
                            <span className="flex-1 h-[2px] bg-[#e07a4c]  rounded"></span>
                            <span className="w-2 h-2 bg-[#e07a4c] rotate-45 block" style={{ borderRadius: '2px' }}></span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-center w-full">
                        <LazyLoadImage
                            src={image4}
                            alt="Profile"
                            className="w-48 h-56 object-cover rounded-md shadow-md bg-gray-200"
                            loading="lazy"
                        />
                        <div className="flex-1 flex flex-col gap-3 w-full">
                            <p className="text-[rgba(30,30,30,0.5)] lg:text-[16px] text-[14px]  leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing eli.
                            </p>
                            {/* Decorative line after paragraph */}
                            <div className="w-full flex justify-start my-2">
                                <div className="flex items-center w-[60%]">
                                    <span className="flex-1 h-[2px] bg-[#e07a4c] rounded"></span>
                                </div>
                            </div>
                            <span className="text-[rgba(139,0,0,1)] font-normal font-marcellus text-[16px] lg:text-[20px]">
                                John Doe
                            </span>
                            <div className="flex items-center justify-between w-full mt-2 gap-2">
                                <button className="px-5 py-2 bg-[rgba(139,0,0,1)] text-white  hover:bg-[#a32d13] transition-colors lg:text-[14px] text-[12px] font-semibold w-max">
                                    Know More
                                </button>
                                <div className="flex gap-2 ml-auto">
                                    <button
                                        aria-label="Previous"
                                        className="w-8 h-8 flex items-center justify-center bg-[rgba(139,0,0,1)] text-white rounded hover:bg-[#a32d13] transition-colors"
                                    >
                                        <span className="text-xl">&#8592;</span>
                                    </button>
                                    <button
                                        aria-label="Next"
                                        className="w-8 h-8 flex items-center justify-center bg-white border border-[#7c0a02] text-[#7c0a02] rounded hover:bg-[#f7e6e0] transition-colors"
                                    >
                                        <span className="text-xl">&#8594;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Background Image with Overlapping Sections */}
            <div className="relative w-full mt-8 mb-4 lg:mt-[300px] lg:mb-[100px]">

                {/* Mobile Layout - Vertical Stack */}
                <div className="block lg:hidden">
                    {/* Red Donation Section - Mobile */}
                    <div className="w-full bg-[#8b0000] py-6 px-4 mb-0 relative">
                        <LazyLoadImage
                            className="absolute w-[60px] h-[70px] top-2 left-2"
                            alt="Decorative Image"
                            src={mand9Min2}
                            loading="lazy"
                        />
                        <LazyLoadImage
                            className="absolute w-[100px] h-[100px] bottom-2 right-2"
                            alt="Decorative Image"
                            src={mand9Min3}
                            loading="lazy"
                        />
                        {/* Center Top Decorative Image - Half inside, half outside */}
                        <LazyLoadImage
                            className="absolute w-[120px] h-[120px] top-[-60px] left-1/2 transform -translate-x-1/2 object-cover opacity-80 z-10"
                            alt="Decorative Image"
                            src={mand9Min1}
                            loading="lazy"
                        />

                        <div className="relative z-10 space-y-4">
                            <div className="text-white mb-4">
                                <h3 className="text-xl font-normal tracking-wide [-webkit-text-stroke:1px_#daa520] font-['Marcellus',serif]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing eli
                                </h3>
                            </div>

                            <div className="flex flex-col space-y-2">
                                {donations.map((donation, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-white/20 pb-2 last:border-b-0">
                                        <div className="flex flex-col">
                                            <div className="font-['Tenor_Sans',sans-serif] font-normal text-white text-sm">
                                                {donation.title}
                                            </div>
                                            <div className="font-['Tenor_Sans',sans-serif] font-normal text-white/50 text-xs">
                                                {donation.description}
                                            </div>
                                        </div>
                                        <Button className="w-16 h-[26px] bg-white rounded-none hover:bg-gray-100">
                                            <span className="font-['Tenor_Sans',sans-serif] font-normal text-[#8b0000] text-xs">
                                                Donate
                                            </span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Background Image - Mobile */}
                    <div className="relative w-full">
                        <LazyLoadImage
                            className="w-full h-[250px] object-cover"
                            alt="Main Background Image"
                            src={image5Webp}
                            loading="lazy"
                        />
                    </div>

                    {/* Orange Avatar Section - Mobile */}
                    <div className="w-full bg-[#d05e2d] py-6 px-4 mt-0">
                        <LazyLoadImage
                            className="absolute w-[60px] h-[70px] top-2 left-2"
                            alt="Decorative Image"
                            src={mand9Min4}
                            loading="lazy"
                        />
                        <LazyLoadImage
                            className="absolute w-[60px] h-[70px] bottom-2 right-2"
                            alt="Decorative Image"
                            src={mand9Min5}
                            loading="lazy"
                        />

                        <div className="flex flex-row justify-around items-center gap-2 relative z-10">
                            {Array(3)
                                .fill(0)
                                .map((_, index) => (
                                    <div key={index} className="flex flex-col items-center text-center">
                                        <Avatar className="w-[45px] h-[45px] bg-[#8b000080] rounded-full border border-white mb-2" />
                                        <div className="max-w-[80px] font-['Tenor_Sans',sans-serif] font-normal text-white text-xs">
                                            Lorem Ispum Dolor
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - Overlapping */}
                <div className="hidden lg:block">
                    {/* Main Background Image */}
                    <LazyLoadImage
                        className="w-full h-[400px] lg:h-[500px] object-cover"
                        alt="Main Background Image"
                        src={image5Webp}
                        loading="lazy"
                    />

                    {/* Red Donation Section - Overlapping top-left */}
                    <div className="absolute top-[-50%] left-7 w-[80%] bg-[#8b0000] py-8 px-8 z-20">
                        <LazyLoadImage
                            className="absolute w-[84px] h-[92px] top-0 left-0"
                            alt="Decorative Image"
                            src={mand9Min2}
                            loading="lazy"
                        />
                        <LazyLoadImage
                            className="absolute w-[145px] h-[145px] bottom-0 right-4"
                            alt="Decorative Image"
                            src={mand9Min3}
                            loading="lazy"
                        />
                        {/* Center Top Decorative Image - Half inside, half outside */}
                        <LazyLoadImage
                            className="absolute w-[200px] h-[200px] top-[-100px] left-1/2 transform -translate-x-1/2 object-cover opacity-80 z-10"
                            alt="Decorative Image"
                            src={mand9Min1}
                            loading="lazy"
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center relative z-10">
                            <div className="text-white">
                                <h3 className="text-2xl lg:text-3xl font-normal tracking-wide [-webkit-text-stroke:1px_#daa520] font-['Marcellus',serif]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing eli
                                </h3>
                            </div>

                            <div className="flex flex-col space-y-3">
                                {donations.map((donation, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-white/20 pb-3 last:border-b-0">
                                        <div className="flex flex-col">
                                            <div className="font-['Tenor_Sans',sans-serif] font-normal text-white text-sm">
                                                {donation.title}
                                            </div>
                                            <div className="font-['Tenor_Sans',sans-serif] font-normal text-white/50 text-xs">
                                                {donation.description}
                                            </div>
                                        </div>
                                        <Button className="w-20 h-[28px] bg-white rounded-none hover:bg-gray-100">
                                            <span className="font-['Tenor_Sans',sans-serif] font-normal text-[#8b0000] text-xs">
                                                Donate
                                            </span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orange Avatar Section - Overlapping bottom-right */}
                    <div className="absolute bottom-[-20%] right-0 w-3/5 bg-[#d05e2d] py-8 px-8 z-20">
                        <LazyLoadImage
                            className="absolute w-[84px] h-[92px] top-4 left-4"
                            alt="Decorative Image"
                            src={mand9Min4}
                            loading="lazy"
                        />
                        <LazyLoadImage
                            className="absolute w-[84px] h-[92px] bottom-4 right-4"
                            alt="Decorative Image"
                            src={mand9Min5}
                            loading="lazy"
                        />

                        <div className="flex flex-col md:flex-row justify-around items-center gap-6 relative z-10">
                            {Array(3)
                                .fill(0)
                                .map((_, index) => (
                                    <div key={index} className="flex flex-col items-center text-center">
                                        <Avatar className="w-[60px] h-[60px] bg-[#8b000080] rounded-full border border-white mb-3" />
                                        <div className="max-w-[120px] font-['Tenor_Sans',sans-serif] font-normal text-white text-sm">
                                            Lorem Ispum Dolor
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
