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
import tempImage from '@/assets/images/temp-image.webp';
import tempImage2 from '@/assets/images/temp-image-2.png';
import tempImage3 from '@/assets/images/temp-image-3.webp';
import tempImage4 from '@/assets/images/temp-image-4.webp';
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

// Demo testimonial data
const testimonials = [
    {
        id: 1,
        image: image4,
        name: "John Doe",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        id: 2,
        image: tempImage,
        name: "Jane Smith",
        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
    },
    {
        id: 3,
        image: tempImage2,
        name: "Mike Johnson",
        text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."
    },
    {
        id: 4,
        image: tempImage3,
        name: "Sarah Williams",
        text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer."
    },
    {
        id: 5,
        image: tempImage4,
        name: "David Brown",
        text: "Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure great pleasure."
    }
];


export default function DonationSection() {
    const [shouldStartAnimation, setShouldStartAnimation] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [activeButton, setActiveButton] = useState<'prev' | 'next' | null>(null);

    const setRef = useIntersectionObserver(() => {
        setShouldStartAnimation(true);
    });

    const nextSlide = () => {
        if (isTransitioning) return;
        console.log('Next slide clicked, current:', currentSlide);
        setIsTransitioning(true);
        setActiveButton('next');
        setCurrentSlide((prev) => {
            const newSlide = (prev + 1) % testimonials.length;
            console.log('Moving to slide:', newSlide);
            return newSlide;
        });
        setTimeout(() => {
            setIsTransitioning(false);
            setActiveButton(null);
        }, 300);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        console.log('Previous slide clicked, current:', currentSlide);
        setIsTransitioning(true);
        setActiveButton('prev');
        setCurrentSlide((prev) => {
            const newSlide = (prev - 1 + testimonials.length) % testimonials.length;
            console.log('Moving to slide:', newSlide);
            return newSlide;
        });
        setTimeout(() => {
            setIsTransitioning(false);
            setActiveButton(null);
        }, 300);
    };

    const currentTestimonial = testimonials[currentSlide];

    return (
        <section ref={setRef} className="w-full bg-[rgba(244,240,236,1)] py-8 lg:py-16 px-4 md:px-0">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Stats */}
                <div className="flex flex-col gap-8">
                    <p className="text-[rgba(76,41,30,1)] font-primaryFont text-[17px] lg:text-[20px] max-w-xs mb-4">
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
                    <h2 className="text-[rgba(76, 41, 30, 1)] text-[26px] lg:text-[36px] font-primaryFont font-normal leading-tight mb-2">
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
                    <div className="flex flex-col md:flex-row gap-6 w-full h-auto md:h-64">
                        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                            <LazyLoadImage
                                src={currentTestimonial.image}
                                alt={`Profile of ${currentTestimonial.name}`}
                                className="w-full md:w-64 h-64 object-cover rounded-md shadow-md bg-gray-200"
                                loading="lazy"
                            />
                        </div>
                        <div className={`flex-1 flex flex-col justify-between h-full md:h-64 gap-3 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="flex-1">
                                <p className="text-[rgba(30,30,30,0.5)] lg:text-[16px] text-[14px] leading-relaxed font-secondaryFont mb-4">
                                    {currentTestimonial.text}
                                </p>
                                {/* Decorative line after paragraph */}
                                <div className="w-full flex justify-start mb-3">
                                    <div className="flex items-center w-[60%]">
                                        <span className="flex-1 h-[2px] bg-[#e07a4c] rounded"></span>
                                    </div>
                                </div>
                                <span className="text-[rgba(139,0,0,1)] font-normal font-primaryFont text-[16px] lg:text-[20px]">
                                    {currentTestimonial.name}
                                </span>
                            </div>
                            <div className="flex items-center justify-end w-full mt-auto">
                                {/* <button className="px-5 py-2 bg-[rgba(139,0,0,1)] text-white hover:bg-[#a32d13] transition-colors lg:text-[14px] text-[12px] font-secondaryFont font-semibold">
                                    Know More
                                </button> */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevSlide}
                                        disabled={isTransitioning}
                                        aria-label="Previous testimonial"
                                        className={`w-8 h-8 flex items-center justify-center rounded border border-[#7c0a02] transition-all duration-200 font-secondaryFont disabled:opacity-50 transform 
                                            ${activeButton === 'prev'
                                                ? 'bg-[rgba(139,0,0,1)] text-white scale-95 shadow-inner'
                                                : 'bg-white text-[#7c0a02] hover:bg-[rgba(139,0,0,1)] hover:text-white active:scale-95 active:shadow-inner'
                                            }`}
                                    >
                                        <span className="text-xl">&#8592;</span>
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        disabled={isTransitioning}
                                        aria-label="Next testimonial"
                                        className={`w-8 h-8 flex items-center justify-center rounded border border-[#7c0a02] transition-all duration-200 font-secondaryFont disabled:opacity-50 transform ${activeButton === 'next'
                                                ? 'bg-[rgba(139,0,0,1)] text-white scale-95 shadow-inner'
                                                : 'bg-white text-[#7c0a02] hover:bg-[rgba(139,0,0,1)] hover:text-white active:scale-95 active:shadow-inner'
                                            }`}
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
            <div className="relative w-full mt-8 mb-4 lg:mt-[300px] lg:mb-[80px]">

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
                        <div className="absolute w-[900px] top-[-120px] left-[40%] transform -translate-x-1/2 z-10 overflow-hidden" style={{ height: '120px' }}>
                            <LazyLoadImage
                                className="w-full object-cover opacity-80"
                                alt="Decorative Image"
                                src={mand9Min1}
                                loading="lazy"
                            />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="text-white mb-4">
                                <h3 className="text-xl font-normal tracking-wide [-webkit-text-stroke:1px_#d05e2d] font-primaryFont text-secondaryColor">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing eli
                                </h3>
                            </div>

                            <div className="flex flex-col space-y-2">
                                {donations.map((donation, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-white/20 pb-2 last:border-b-0">
                                        <div className="flex flex-col">
                                            <div className="font-secondaryFont font-normal text-white text-[16px]">
                                                {donation.title}
                                            </div>
                                            <div className="font-secondaryFont font-normal text-white/50 text-[12px]">
                                                {donation.description}
                                            </div>
                                        </div>
                                        <Button className="w-16 h-[26px] bg-white rounded-none hover:bg-gray-100 font-secondaryFont">
                                            <span className="font-secondaryFont font-normal text-[#8b0000] text-xs">
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
                    <div className="w-full bg-secondaryColor py-6 px-4 mt-0">
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
                <div className="hidden lg:block  ">
                    {/* Main Background Image */}
                    <LazyLoadImage
                        className="w-full h-[400px] lg:h-[500px] object-cover"
                        alt="Main Background Image"
                        src={image5Webp}
                        loading="lazy"
                    />

                    {/* Red Donation Section - Overlapping top-left */}
                    <div className="absolute top-[-30%] left-7 w-[80%] bg-[#8b0000] py-8 px-8 z-20">
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
                        <div className="absolute w-[900px] top-[-170px] left-[35%] transform -translate-x-1/2 z-10 overflow-hidden" style={{ height: '170px' }}>
                            <LazyLoadImage
                                className="w-full object-cover opacity-80"
                                alt="Decorative Image"
                                src={mand9Min1}
                                loading="lazy"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center relative z-10">
                            <div className="text-white">
                                <h3 className="text-2xl lg:text-3xl font-normal tracking-wide [-webkit-text-stroke:1px_#d05e2d] font-primaryFont text-secondaryColor">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing eli
                                </h3>
                            </div>

                            <div className="flex flex-col space-y-3">
                                {donations.map((donation, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-white/20 pb-3 last:border-b-0">
                                        <div className="flex flex-col">
                                            <div className="font-secondaryFont font-normal text-white text-sm">
                                                {donation.title}
                                            </div>
                                            <div className="font-secondaryFont font-normal text-white/50 text-xs">
                                                {donation.description}
                                            </div>
                                        </div>
                                        <Button className="w-20 h-[28px] bg-white rounded-none hover:bg-gray-100 font-secondaryFont">
                                            <span className="font-secondaryFont font-normal text-[#8b0000] text-xs">
                                                Donate
                                            </span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orange Avatar Section - Overlapping bottom-right */}
                    <div className="absolute bottom-[-20%] right-0 w-3/5 bg-secondaryColor py-8 px-8 z-20">
                        <LazyLoadImage
                            className="absolute w-[84px] h-[92px] top-0 left-0"
                            alt="Decorative Image"
                            src={mand9Min4}
                            loading="lazy"
                        />
                        <LazyLoadImage
                            className="absolute w-[84px] h-[92px] bottom-0 right-0"
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
                                        <div className="max-w-[120px] font-secondaryFont font-normal text-white text-sm">
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
