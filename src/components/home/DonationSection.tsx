import { useState, useEffect, } from "react";
import { useI18n } from '@/lib/i18n';
import { useGetTestimonials } from '@/api/TestimonialQueries';
import type { TestimonialItem } from '@/services/testimonial.service';


// Image imports
import image4 from '@/assets/images/image-4.png';

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
    const displayValue = amount.toLowerCase().includes('+')
        ? `${count}+`
        : count.toString();

    return (
        <li className="flex items-center gap-3">
            <span className="textHeadingLg font-marcellus  font-semibold text-[rgba(76,41,30,1)]">
                {displayValue}
                {/* <span className=" align-super">+</span> */}
            </span>
            <span className="text-[rgba(76,41,30,1)] textDescription font-normal font-secondaryFont">
                {label}
            </span>
        </li>
    );
};




export default function DonationSection() {
    const { t } = useI18n();

    // Load stats from i18n; fallback to DEFAULT_STATS
    type Stat = { amount: string; label: string };
    // Try structured keys first (Leftsection / Rightsection), then flat keys
    const leftSection = t('donation.Leftsection') || t('donation.leftsection');
    const rightSection = t('donation.Rightsection') || t('donation.rightsection');

    const donationStats: Stat[] = (leftSection && leftSection.stats) || (t('donation.stats') as Stat[]) || [];

    // Load testimonials expecting { name, message } in JSON. Map message -> text.
    const rawTestimonialsSource = (rightSection && rightSection.testimonials) || (t('donation.testimonials') as any[]) || [];
    const rawTestimonials = rawTestimonialsSource.map((it: any, idx: number) => ({
        id: it.id || idx + 1,
        imageKey: it.imageKey || 'tempImage',
        name: it.name || it.title || `Guest ${idx + 1}`,
        text: it.text || it.message || it.desc || '',
    }));

    // Map imageKey to actual imported images
    const imageMap: Record<string, any> = {
        image4,
        tempImage,
        tempImage2,
        tempImage3,
        tempImage4,
    };

    // Fetch testimonials from API and prefer non-carousel items from API
    const { data: apiTestimonials = [] } = useGetTestimonials();

    // Filter API results: non-carousel and active only
    const apiFiltered: TestimonialItem[] = (apiTestimonials || []).filter((it: TestimonialItem) => it?.isActive && !it?.isCarousel);

    // Map API items into the same shape we expect from locales
    const apiMapped = apiFiltered.map((it) => ({
        id: it._id,
        name: it.person?.name ,
        text: it.description ?? '',
        image: it.imageUrl || it.person?.imageUrl ,
    }));

    // Map local/raw testimonials and apply image mapping
    const localMapped = (rawTestimonials || []).map((it: any) => ({
        ...it,
        image: imageMap[it.imageKey] || imageMap['tempImage'] || image4,
    }));

    // Prefer API testimonials (non-carousel) when available, otherwise fall back to local translations
    let testimonials = apiMapped.length > 0 ? apiMapped : localMapped;

    // Final fallback to a placeholder so UI doesn't crash
    if (!testimonials || testimonials.length === 0) {
        testimonials = [
            { id: '0', name: '', text: '', image: imageMap['tempImage'] || image4 },
        ];
    }

    // Ensure currentSlide is in range when testimonials length changes
    useEffect(() => {
        setCurrentSlide((idx) => (idx >= testimonials.length ? 0 : idx));
    }, [testimonials.length]);
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

    // Truncate testimonial text for display
    function truncateByChars(sentence: any, maxLength: number) {
        if (!sentence || typeof sentence !== "string") return "";
        if (sentence.length <= maxLength) return sentence;
        return sentence.slice(0, maxLength).trim() + "...";
    }


    return (
        <section ref={setRef} className="w-full py-4 lg:py-12 px-4 md:px-16 lg:px-24 bg-[#F8F5F0] ">
            <div className=" grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
                {/* Left: Stats */}
                <div className="flex flex-col gap-8">
                    <p className="text-[rgba(76,41,30,1)] font-primaryFont textHeadingLg max-w-xs mb-4">
                        {t('donation.Leftsection.title')}
                    </p>
                    <ul className="flex flex-col gap-3">
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
                <div className="flex flex-col items-start gap-6 w-full mb-4 md:mb-0">
                    <div className="w-full">
                        <h2 className="text-[rgba(76, 41, 30, 1)] textHeadingLg font-primaryFont font-normal leading-tight mb-2">
                            {t('donation.Rightsection.title')}
                        </h2>
                        {/* Decorative line with diamond ends */}
                        <div className="w-full flex justify-start mb-2">
                            <div className="flex items-center w-[80%] ">
                                <span className="w-2 h-2 bg-[#e07a4c] rotate-45 block" style={{ borderRadius: '2px' }}></span>
                                <span className="flex-1 h-[2px] bg-[#e07a4c]  rounded"></span>
                                <span className="w-2 h-2 bg-[#e07a4c] rotate-45 block" style={{ borderRadius: '2px' }}></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full h-auto md:h-66">
                        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                            <LazyLoadImage
                                src={currentTestimonial.image}
                                alt={`Profile of ${currentTestimonial.name}`}
                                className="w-full md:w-64 h-112 object-cover rounded-md shadow-md bg-gray-200"
                                loading="lazy"
                            />
                        </div>
                        <div className={`flex-1 flex flex-col justify-between h-full md:h-64 gap-3 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="flex-1">
                                <p className="text-[rgba(30,30,30,0.5)] textDescription leading-relaxed font-secondaryFont mb-4">
                                   {truncateByChars(currentTestimonial.text, 300)}
                                </p>
                                {/* Decorative line after paragraph */}
                                <div className="w-full flex justify-start mb-3">
                                    <div className="flex items-center w-[60%]">
                                        <span className="flex-1 h-[2px] bg-[#e07a4c] rounded"></span>
                                    </div>
                                </div>
                                <span className="text-[rgba(139,0,0,1)] font-normal font-primaryFont textHeading">
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


        </section>
    );
}
