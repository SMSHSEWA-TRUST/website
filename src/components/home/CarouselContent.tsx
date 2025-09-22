import React, { useEffect, useRef, useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import bhudaan1 from '@/assets/images/bhudaan1.webp';
import comma from '@/assets/images/comaa.png';
import Daanleft from '@/assets/images/daanleftsection.png';
import { useI18n } from '@/lib/i18n';
import { useGetTestimonials } from '@/api/TestimonialQueries';
import type { TestimonialItem } from '@/services/testimonial.service';

type SlideData = {
    id: string;
    title: string;
    role: string;
    org: string;
    quote: string;
    img: string;
};

// slides will be read from translations via useI18n

const Slide: React.FC<{ data: SlideData }> = ({ data }) => {
    return (
        <div className="w-full flex-shrink-0">
            {/* Mobile / Tablet card (stacked, centered) */}
            <div className="xl:hidden w-full  ">
                <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
                    <div className=" flex justify-center">
                        <LazyLoadImage
                            src={data.img}
                            alt={data.title}
                            className="w-full h-full md:h-[400px]  object-cover rounded-md"
                            loading="lazy"
                        />
                    </div>
                    <div className="px-6 pb-6 relative">
                        <h3 className="mt-4 text-2xl font-bold font-primaryFont text-[#8B0000]">{data.title}</h3>
                        <p className="text-sm text-[#8B0000] opacity-90 mt-1 font-semibold">{data.role}</p>
                        <p className="text-xs text-gray-400 mt-2 mb-4" style={{ whiteSpace: 'pre-line' }}>{data.org}</p>

                        <div className="absolute top-[65px] left-7 text-[#D05E2D] text-[80px] font-primaryFont leading-none ">“</div>
                        <p className="relative z-10 text-[#8B0000] textDescription leading-relaxed">{data.quote}</p>

                    </div>
                </div>
            </div>

            {/* Desktop / large layout (original) */}
            <div className="hidden xl:flex w-full">
                <div className="w-full flex flex-col lg:flex-row h-80 sm:h-80 md:h-96 lg:h-[366px]">
                    {/* Left */}
                    <div className="w-full lg:w-[40%] h-full">
                        <LazyLoadImage
                            src={data.img}
                            alt={data.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            style={{
                                clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0% 100%)',
                            }}
                        />
                    </div>

                    {/* Center */}
                    <div className="w-full lg:w-[50%] h-full bg-white flex flex-col justify-center   relative ">
                        <div className="absolute top-12 left-6 lg:left-10 text-[#d05e2d] text-[120px] font-serif leading-none">
                            <img src={comma} alt="," className="w-12 h-12 lg:w-12 lg:h-12" />
                        </div>
                        <div className="mt-12 lg:mt-16 text-center ">
                            <p className="text-[#8B0000] textDescription  font-normal font-secondaryFont mb-8">
                                {data.quote}
                            </p>
                        </div>
                    </div>


                    <div
                        className="w-full lg:w-[30%] h-full relative flex items-end justify-start pl-20 text-white"
                    >
                        <img
                            src={Daanleft}
                            alt="left design"
                            className="absolute inset-0 w-[100%] h-full object-fit"
                        />

                        {/* Text content */}
                        <div className="relative z-10 mb-4 text-left">
                            <h3 className="textHeadingLg font-bold font-primaryFont mb-2">
                                {data.title}
                            </h3>

                            {/* Add underline here */}
                            <p className="textDescription font-secondaryFont font-semibold mb-2 opacity-90 border-b border-white inline-block pb-1">
                                {data.role}
                            </p>
                            <p
                                className="textDescription text-[#FFFFFFB3] opacity-80 leading-relaxed font-secondaryFont "
                                style={{ whiteSpace: "pre-line" }}
                            >
                                {data.org}
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

const CarouselContent: React.FC = () => {
    const { t } = useI18n();

    const slidesFromLocale = t('carousel.slides') as Record<string, any> | undefined;



    const { data: apiTestimonials = [] } = useGetTestimonials();

    

    const filtered: TestimonialItem[] = apiTestimonials.filter((it) => it?.isActive && it?.isCarousel);
    const apiSlides = filtered.length > 0
        ? filtered.map((item) => ({
            id: item._id,
            title: item.person?.name ?? item.title ?? 'Anonymous',
            role: item.person?.designation ?? '',
            org: item.title ?? item.createdBy ?? '',
            quote: item.description ?? '',
            img: item.imageUrl ?? item.person?.imageUrl ?? bhudaan1,
        })) as SlideData[]
        : undefined;


    const slides = apiSlides ?? (slidesFromLocale
        ? Object.keys(slidesFromLocale).map((k) => ({ id: k, img: bhudaan1, ...slidesFromLocale[k] })) as SlideData[]
        : [
            { id: 'a', title: 'RATAN LAL JI', role: 'Honourable Trustee', org: 'Shree Mahakaleshwar Salasar \nHanuman Sewa Trust', quote: '', img: bhudaan1 },
            { id: 'b', title: 'ANITA DEVI', role: 'Volunteer Lead', org: 'Shree Mahakaleshwar Salasar \nHanuman Sewa Trust', quote: '', img: bhudaan1 },
        ]);

    const [index, setIndex] = useState(1); // start at 1 because of cloned slides
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const intervalRef = useRef<number | null>(null);

    // build slides with clones: [last, ...slides, first]
    const total = slides.length;
    const displaySlides = [slides[total - 1], ...slides, slides[0]];

    useEffect(() => {
        // autoplay
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!isPaused) {
            intervalRef.current = window.setInterval(() => {
                setIndex((i) => i + 1);
                setIsTransitioning(true);
            }, 3500) as unknown as number;
        }

        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, [isPaused]);

    useEffect(() => {
        // when index moves to clone boundaries, adjust after transition
        if (!isTransitioning) return;
        const handle = () => {
            if (index === 0) {
                // jumped to cloned last -> reset to real last
                setIsTransitioning(false);
                setIndex(total);
            } else if (index === total + 1) {
                // jumped to cloned first -> reset to real first
                setIsTransitioning(false);
                setIndex(1);
            }
        };
        // check after a short timeout matching transition duration
        const t = window.setTimeout(handle, 620);
        return () => clearTimeout(t);
    }, [index, total, isTransitioning]);

    // enable transition when index changes to something in bounds
    useEffect(() => {
        // if we turned off transition to perform swap, re-enable on next tick
        if (!isTransitioning) {
            const t = window.setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(t);
        }
    }, [isTransitioning]);

    const onMouseEnter = () => setIsPaused(true);
    const onMouseLeave = () => setIsPaused(false);

    const trackStyle: React.CSSProperties = {
        display: 'flex',
        width: `${displaySlides.length * 100}%`,
        transform: `translateX(-${index * (100 / displaySlides.length)}%)`,
        transition: isTransitioning ? 'transform 600ms ease' : 'none',
    };

    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="relative">
            <div ref={trackRef} style={trackStyle}>
                {displaySlides.map((s, i) => (
                    <div key={s.id + '-' + i} style={{ width: `${100 / displaySlides.length}%` }}>
                        <Slide data={s} />
                    </div>
                ))}
            </div>

            {/* controls  small dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
                {slides.map((_, i) => {
                    const active = index === i + 1 || (index === 0 && i === total - 1) || (index === total + 1 && i === 0);
                    return (
                        <button
                            key={i}
                            onClick={() => setIndex(i + 1)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${active ? 'bg-[#d05e2d] ring-2 ring-white' : 'bg-white/80 ring-1 ring-[#d05e2d]/40'}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CarouselContent;
