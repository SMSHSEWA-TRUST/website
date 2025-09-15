
import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';

const images: string[] = [
    new URL('../../assets/images/About.webp', import.meta.url).href,
    new URL('../../assets/images/Aboutworship.png', import.meta.url).href,
    new URL('../../assets/images/blogarti1.webp', import.meta.url).href,
    new URL('../../assets/images/blogarti2.webp', import.meta.url).href,
    new URL('../../assets/images/blogarti3.webp', import.meta.url).href,
    new URL('../../assets/images/image-4.png', import.meta.url).href,
    new URL('../../assets/images/image-5.webp', import.meta.url).href,
    new URL('../../assets/images/ganesh.webp', import.meta.url).href,
];

export default function Gallery(): JSX.Element {

    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!isOpen) return;
            if (e.key === 'Escape') setIsOpen(false);
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, current]);

    function openAt(i: number) {
        setCurrent(i);
        setIsOpen(true);
    }

    function next() {
        setCurrent((c) => (c + 1) % images.length);
    }

    function prev() {
        setCurrent((c) => (c - 1 + images.length) % images.length);
    }

    // close when clicking overlay (but not when clicking the image/content)
    function onOverlayClick(e: React.MouseEvent) {
        if (e.target === containerRef.current) setIsOpen(false);
    }

    if (images.length === 0) {
        return <div className="p-6 text-center text-gray-500">No images available.</div>;
    }

    return (
        <section className="lg:py-20 px-4 md:px-16 lg:px-24 flex flex-col gap-4 lg:gap-10">
            {/* Section Title */}
            <h2 className="font-primaryFont text-[#8B0000] textHeadingLg  font-normal text-center">
                {t('GalleryPage.title')}
            </h2>
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((src, i) => (
                    <button
                        type="button"
                        key={src}
                        onClick={() => openAt(i)}
                        className="group relative overflow-hidden rounded-lg shadow-sm focus:outline-none"
                        aria-label={`Open image ${i + 1} of ${images.length}`}
                    >
                        <img
                            src={src}
                            alt={`Gallery image ${i + 1}`}
                            className="w-full h-28 sm:h-36 md:h-44 lg:h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>


            {isOpen && (
                <div
                    ref={containerRef}
                    onClick={onOverlayClick}
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Fixed subtle vignette + blur background for a polished photo-viewer feel */}
                    <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none bg-black/50 backdrop-blur-sm -webkit-backdrop-blur-sm"
                       
                    />

                    <div className="relative max-w-[90vw] max-h-[90vh] w-full z-30">
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close gallery"
                            className="absolute top-[-50px] right-0 z-40 rounded-full bg-white/90 text-gray-800 hover:bg-white p-2 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0 0-1.4z" />
                            </svg>
                        </button>

                        <img
                            src={images[current]}
                            alt={`Large image ${current + 1}`}
                            className="mx-auto block max-w-full max-h-[80vh] rounded-md shadow-2xl"
                        />

                        {/* Prev */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                                aria-label="Previous image"
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/90 p-2 hover:bg-white shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                </svg>
                            </button>
                        )}

                        {/* Next */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                                aria-label="Next image"
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/90 p-2 hover:bg-white shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                                    <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                                </svg>
                            </button>
                        )}

                        {/* Counter */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 rounded-md bg-black/50 text-white text-sm px-3 py-1">
                            {current + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
