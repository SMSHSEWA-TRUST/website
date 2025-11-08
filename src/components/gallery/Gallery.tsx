
import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useGetGallery } from '@/api/GalleryQueries';
import Masonry from 'react-masonry-css';
import { GalleryItem } from '@/services/gallery.service';

export default function Gallery(): JSX.Element {

    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const [scale, setScale] = useState<number>(1);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { data: galleryData, isLoading, error } = useGetGallery();
    const galleryItems: GalleryItem[] = galleryData?.data || [];

    // Responsive breakpoints for masonry columns
    // Mobile: 2 columns, SM: 2 columns, MD: 3 columns, LG+: 4 columns, XL+: 4 columns
    const breakpointColumnsObj = {
        default: 4,    // Desktop and larger
        1280: 4,       // xl breakpoint
        1024: 3,       // lg breakpoint
        768: 3,        // md breakpoint (tablet)
        640: 2,        // sm breakpoint
        480: 2         // mobile breakpoint - 2 columns looks better than 1
    };

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

    // Lock background scrolling when modal is open and restore on close
    useEffect(() => {
        const prev = document.body.style.overflow;
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    function openAt(i: number) {
        setCurrent(i);
        setScale(1);
        setIsOpen(true);
    }

    function next() {
        setCurrent((c) => (c + 1) % galleryItems.length);
        setScale(1);
    }

    function prev() {
        setCurrent((c) => (c - 1 + galleryItems.length) % galleryItems.length);
        setScale(1);
    }

    function onOverlayClick(e: React.MouseEvent) {
        if (e.target === containerRef.current) setIsOpen(false);
    }

    function onImageWheel(e: React.WheelEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY;
        setScale((s) => {
            const factor = delta > 0 ? 0.95 : 1.05;
            const next = Math.min(3, Math.max(0.5, +(s * factor).toFixed(2)));
            return next;
        });
    }

    function onImageDoubleClick() {
        setScale(1);
    }

    if (isLoading) {
        return (
            <div className="py-20 px-4 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8B0000] border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading gallery...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 px-4 text-center">
                <p className="text-red-500 text-lg">Error loading gallery</p>
                <p className="text-gray-500 mt-2">{(error as Error).message}</p>
            </div>
        );
    }

    if (galleryItems.length === 0) {
        return (
            <div className="py-20 px-4 text-center">
                <p className="text-gray-500 text-lg">No images available in the gallery.</p>
            </div>
        );
    }

    return (
        <section className="py-8 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
            <div className="max-w-[2000px] mx-auto">
                {/* Section Title */}
                <h2 className="font-primaryFont text-[#8B0000] textHeadingLg font-normal text-center mb-8 sm:mb-10 lg:mb-12">
                    {t('GalleryPage.title')}
                </h2>

                {/* Masonry Gallery with responsive columns */}
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {galleryItems.map((item: GalleryItem, i: number) => (
                        <div key={item._id || i}>
                            <button
                                type="button"
                                onClick={() => openAt(i)}
                                className="group relative block w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:ring-offset-2 bg-gray-100"
                                aria-label={`Open image ${i + 1} of ${galleryItems.length}${item.title ? `: ${item.title}` : ''}`}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title || `Gallery image ${i + 1}`}
                                    className="w-full h-auto object-cover block transition-transform duration-300 ease-out group-hover:scale-105"
                                    loading="lazy"
                                    style={{ willChange: 'transform' }}
                                />
                                {/* Subtle overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </button>
                        </div>
                    ))}
                </Masonry>
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div
                    ref={containerRef}
                    onClick={onOverlayClick}
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    {/* Backdrop with blur effect */}
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal content container */}
                    <div className="relative w-full max-w-7xl max-h-[95vh] z-10">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close gallery"
                            className="absolute -top-12 sm:-top-14 right-0 z-50 rounded-full bg-white/95 hover:bg-white text-gray-800 p-2.5 sm:p-3 shadow-lg transition-all hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
                                <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0 0-1.4z" />
                            </svg>
                        </button>

                        {/* Image container with zoom support */}
                        <div
                            onWheel={onImageWheel}
                            onDoubleClick={onImageDoubleClick}
                            className="flex items-center justify-center rounded-lg overflow-hidden"
                            style={{ touchAction: 'none' }}
                        >
                            <img
                                src={galleryItems[current]?.imageUrl}
                                alt={galleryItems[current]?.title || `Image ${current + 1}`}
                                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                                style={{
                                    transform: `scale(${scale})`,
                                    transition: 'transform 150ms ease-out',
                                    willChange: 'transform',
                                }}
                            />
                        </div>

                        {/* Navigation buttons - Previous */}
                        {galleryItems.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                                aria-label="Previous image"
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/95 hover:bg-white p-2.5 sm:p-3 shadow-lg transition-all hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
                                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                </svg>
                            </button>
                        )}

                        {/* Navigation buttons - Next */}
                        {galleryItems.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                                aria-label="Next image"
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/95 hover:bg-white p-2.5 sm:p-3 shadow-lg transition-all hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
                                    <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                                </svg>
                            </button>
                        )}

                        {/* Image counter and zoom hint */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
                            <div className="rounded-lg bg-black/70 backdrop-blur-sm text-white text-sm sm:text-base px-4 py-2 shadow-lg">
                                {current + 1} / {galleryItems.length}
                            </div>
                            {scale !== 1 && (
                                <div className="text-white/80 text-xs sm:text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                    {Math.round(scale * 100)}% • Double-click to reset
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
