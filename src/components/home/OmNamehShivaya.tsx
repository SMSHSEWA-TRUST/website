
import { useGetFeature } from '@/api/FeatureQueries';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import templeImage1 from "@/assets/images/leftVideoImage.png";
import templeImage2 from "@/assets/images/rightVedioImage.png"

const OmNamehShivaya = (): JSX.Element => {
    const { data } = useGetFeature();
    const multipurposeItem = (data as any)?.data?.find((item: any) => item.purpose === 'multipurpose');
    const isVideo = multipurposeItem?.fileUrl && (multipurposeItem.fileUrl.includes('.mp4') || multipurposeItem.fileUrl.includes('.webm') || multipurposeItem.fileUrl.includes('.avi'));
    const videoRef = useRef<HTMLVideoElement>(null);
    const overlayRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoClick = () => {
        // Open overlay player when user clicks the center video
        if (!isPlaying) {
            setIsPlaying(true);
        } else {
            // if already playing in overlay, close it
            setIsPlaying(false);
        }
    };

    const closeOverlay = () => {
        // pause overlay and close
        if (overlayRef.current) {
            try { overlayRef.current.pause(); } catch { }
        }
        setIsPlaying(false);
    };

    // When overlay opens, pause the inline video (to avoid double playback)
    // and start playing the overlay video. When overlay closes, pause overlay video.
    useEffect(() => {
        if (isPlaying) {
            if (videoRef.current) {
                try { videoRef.current.pause(); } catch { }
            }
            // try to play overlay video after it mounts
            setTimeout(() => {
                if (overlayRef.current) {
                    try { overlayRef.current.currentTime = 0; overlayRef.current.play(); } catch { }
                }
            }, 50);
            // lock scroll
            document.body.style.overflow = 'hidden';
        } else {
            // restore scroll
            document.body.style.overflow = '';
            if (overlayRef.current) {
                try { overlayRef.current.pause(); } catch { }
            }
        }

        // cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [isPlaying]);

    // close overlay on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isPlaying) closeOverlay();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isPlaying]);

    // add/remove body class to blur page when overlay open and inject CSS once
    useEffect(() => {
        const styleId = 'omnameh-video-overlay-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                body.video-overlay-open > *:not(.video-overlay) {
                    filter: blur(6px) saturate(0.95);
                    transition: filter 240ms ease;
                    pointer-events: none;
                    user-select: none;
                }
            `;
            document.head.appendChild(style);
        }

        if (isPlaying) {
            document.body.classList.add('video-overlay-open');
        } else {
            document.body.classList.remove('video-overlay-open');
        }

        return () => document.body.classList.remove('video-overlay-open');
    }, [isPlaying]);

    // build overlay portal element (rendered to document.body)
    const overlayPortal = (isPlaying && multipurposeItem && isVideo && typeof document !== 'undefined') ? createPortal(
        <div
            className="video-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
                if ((e.target as HTMLElement).dataset?.overlay === 'backdrop') closeOverlay();
            }}
            data-overlay="backdrop"
        >
            <div className="relative w-[90%] max-w-5xl mx-auto" onClick={(e) => e.stopPropagation()}>
                <video
                    ref={overlayRef}
                    className="w-full h-auto rounded-2xl shadow-2xl bg-black"
                    controls
                    src={multipurposeItem.fileUrl}
                    playsInline
                    autoPlay
                    muted={isMuted}
                />

                <button
                    aria-label="Close video"
                    onClick={closeOverlay}
                    className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                >
                    <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            <section className="relative w-full  overflow-hidden">

                {/* Desktop three-column layout: hidden on small screens */}
                <div className="relative hidden lg:flex items-center justify-center w-full mb-2">
                    {/* Left Side Image - 30% width */}
                    <div className="w-[30%] flex-shrink-0">
                        <div className="relative h-[300px] overflow-hidden rounded-lg shadow-xl">
                            <img
                                src={templeImage1}
                                alt="Temple View 1"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Center Video Section - 50% width, Elevated and Overlapping */}
                    <div className="w-[50%] flex-shrink-0 relative -mx-12 z-20">
                        <div className="relative">
                            <div className={`relative transform transition-all duration-500 origin-center ${isPlaying ? 'scale-105' : 'scale-100'} rounded-2xl overflow-hidden shadow-2xl`}>
                                {multipurposeItem && (
                                    <div className="relative group cursor-pointer" onClick={handleVideoClick}>
                                        {/* Inline (placeholder) video - hidden when overlay open to avoid double playback */}
                                        <video
                                            ref={videoRef}
                                            className={`w-full h-[300px] object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                            muted={isMuted}
                                            loop
                                            playsInline
                                        >
                                            <source src={multipurposeItem.fileUrl} type="video/mp4" />
                                        </video>

                                        {/* Play/Pause Button Overlay */}
                                        {!isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                                                <div className="w-24 h-24 rounded-full bg-white/95 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                                    <svg
                                                        className="w-12 h-12 text-orange-600 ml-1"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}


                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* overlay rendered via portal (see overlayPortal const) */}

                    {/* Right Side Image - 30% width */}
                    <div className="w-[30%] flex-shrink-0">
                        <div className="relative h-[300px] overflow-hidden rounded-lg shadow-xl">
                            <img
                                src={templeImage2}
                                alt="Temple View 2"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Layout - Stack vertically: top image, elevated overlapping center video, bottom image */}
                <div className="flex flex-col lg:hidden items-center gap-4 relative mb-2">
                    {/* Top image */}
                    <div className="w-full z-10">
                        <div className="relative h-40 sm:h-48 overflow-hidden rounded-lg shadow-lg">
                            <img src={templeImage1} alt="Temple Top" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Center video - elevated and overlapping top & bottom images */}
                    <div className="w-full  -mt-16 sm:-mt-20 z-20 mx-auto">
                        <div className={`relative transform transition-all duration-300 ${isPlaying ? 'scale-105 shadow-2xl' : 'shadow-xl'} rounded-2xl overflow-hidden`}>
                            {multipurposeItem && (
                                <div className="relative group cursor-pointer" onClick={handleVideoClick}>
                                    <video
                                        ref={videoRef}
                                        className={`w-full h-56 sm:h-72 object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                        muted={isMuted}
                                        loop
                                        playsInline
                                    >
                                        <source src={multipurposeItem.fileUrl} type="video/mp4" />
                                    </video>

                                    {!isPlaying && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                                <svg className="w-8 h-8 text-orange-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsMuted(!isMuted);
                                        }}
                                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                                    >
                                        {isMuted ? (
                                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom image - moved up so center video overlaps it */}
                    <div className="w-full -mt-12 z-10">
                        <div className="relative h-40 sm:h-48 overflow-hidden rounded-lg shadow-lg">
                            <img src={templeImage2} alt="Temple Bottom" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>
            {overlayPortal}
        </>
    );
};

export default OmNamehShivaya; 