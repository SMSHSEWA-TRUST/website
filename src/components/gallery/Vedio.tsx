import React, { useRef, useState, useEffect } from 'react';
import worshipImg from '@/assets/images/Aboutworship.png';

type Props = {
    /** Public path or imported src for the video. If not provided, place a file at public/videos/puja.mp4 */
    videoSrc?: string;
    /** Optional poster image override */
    poster?: string;
};

const Vedio: React.FC<Props> = ({ videoSrc = '/videos/puja.mp4', poster = worshipImg }) => {
    const [open, setOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleOpen = () => {
        setOpen(true);
        // autoplay handled after modal opens
        requestAnimationFrame(() => videoRef.current?.play().catch(() => { }));
    };

    const handleClose = () => {
        videoRef.current?.pause();
        videoRef.current && (videoRef.current.currentTime = 0);
        setOpen(false);
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (open) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.documentElement.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';
                document.documentElement.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [open]);

    return (
        <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 transform">
            {/* Poster / hero */}
            <div className="relative w-full">
                <img
                    src={poster}
                    alt="video poster"
                    className="w-full h-[520px] sm:h-[560px] md:h-[640px] object-cover"
                />

                {/* dark overlay to match the image style in the reference */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Play button centered */}
                <button
                    onClick={handleOpen}
                    aria-label="Play video"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform z-20 flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:scale-105"
                >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7L8 5z" fill="#111827" />
                    </svg>
                </button>
            </div>

            {/* Modal video */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="w-full max-w-5xl">
                        <div className="relative pt-[56.25%]">{/* 16:9 aspect */}
                            <video
                                ref={videoRef}
                                className="absolute left-0 top-0 h-full w-full object-cover"
                                src={videoSrc}
                                poster={poster}
                                controls
                                playsInline
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleClose}
                                aria-label="Close video"
                                className="inline-flex items-center rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Vedio;
