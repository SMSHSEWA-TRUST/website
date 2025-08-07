import { useState, useEffect } from 'react';
import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import mand7Png from '@/assets/images/mand-7.png';
import omPng from '@/assets/images/om.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Video Player Component - Reusable for both layouts
const VideoPlayerSection = ({ selectedTemple, isDesktop }: {
    selectedTemple: string;
    isDesktop: boolean;
}) => {
    return (
        <div className={isDesktop ? "flex-shrink-0 h-full flex-1 flex flex-col" : ""}>
            <div className={`relative bg-gray-900 overflow-hidden shadow-2xl ${isDesktop ? "w-[800px] h-full" : "rounded-lg"}`} style={isDesktop ? { height: '100%' } : {}}>
                {/* Video Player */}
                <div className={isDesktop ? "relative w-full h-full" : "relative aspect-video"}>
                    {selectedTemple === 'mahakaleshwar' && (
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/SyvlfWBCw7I?si=MjvSk7Uxks9welTV&controls=1&autoplay=1&mute=1"
                            title="Live Darshan Video - Mahakaleshwar"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}

                    {selectedTemple === 'salasar' && (
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/lW--ukmD8Wc?si=sXMi9WppuEPEX83C&controls=1&autoplay=1&mute=1"
                            title="Live Darshan Video - Salasar Balaji"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}

                    {/* Live Badge */}
                    <Badge className="absolute top-4 right-4 bg-red-600 text-white border-white px-3 py-1 shadow-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Live</span>
                        </div>
                    </Badge>

                    {/* Volume Control */}
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.817L4.146 13.04a1 1 0 01-.146-.817V7.777a1 1 0 01.146-.817L8.383 3.076zM14 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1zM16 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Seva Section Component - Reusable for both layouts
const SevaSection = ({ isDesktop, upcomingSevas }: {
    isDesktop: boolean;
    upcomingSevas: Array<{
        title: string;
        description: string;
        date: string;
        time: string;
    }>;
}) => {
    return (
        <div className={isDesktop ? "flex-shrink-0 w-[320px]" : ""}>
            <Card className={`bg-white shadow-lg ${isDesktop ? "h-full" : ""}`}>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <LazyLoadImage
                            className="w-7 h-7 object-contain text-red-800"
                            alt="Om Symbol"
                            src={omPng}
                            style={{ filter: 'invert(16%) sepia(97%) saturate(7492%) hue-rotate(353deg) brightness(90%) contrast(98%)' }} // ensures red color if SVG, else remove
                            loading="lazy"
                        />
                        <CardTitle className="text-[rgba(139,0,0,1)] font-marcellus text-[20px] lg:text-[24px] font-normal">
                            Upcoming Seva's
                        </CardTitle>
                    </div>
                    <div className="relative mt-1">
                        <div className="h-0.5 bg-red-800 w-full"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-800 rotate-45 rounded-sm"></div>
                    </div>
                </CardHeader>

                <CardContent className={`space-y-4 ${isDesktop ? "max-h-[450px] overflow-y-auto" : ""}`}>
                    {upcomingSevas.map((seva, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <h4 className="font-marcellus font-normal text-[rgba(76, 41, 30, 1)] text-[16px] mb-2">
                                {seva.title}
                            </h4>
                            <p className="font-marcellus font-normal text-[rgba(30, 30, 30, 0.5)] text-[10px] leading-relaxed mb-3">
                                {seva.description}
                            </p>
                            <div className="flex justify-between font-tenor-sans font-normal text-[rgba(76, 41, 30, 1)] text-[10px]">
                                <span>{seva.date}</span>
                                <span>{seva.time}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

// Countdown Timer Component - Separate component
const CountdownTimer = ({ countdown, isDesktop }: {
    countdown: string;
    isDesktop: boolean;
}) => {
    return (
        <div className={`bg-yellow-600 text-white py-3 px-6 ${isDesktop ? "w-[320px]" : ""}`}>
            <div className="flex items-center justify-between">
                <span className="font-tenor-sans font-normal text-[12px] text-[rgba(139,0,0,1)]">Countdown Ends In:</span>
                <span className="font-tenor-sans font-normal text-[20px] text-[rgba(139,0,0,1)]">{countdown}</span>
            </div>
        </div>
    );
};

const LiveDarshan = (): JSX.Element => {
    const [selectedTemple, setSelectedTemple] = useState<string>('mahakaleshwar');
    const [videoUrl, setVideoUrl] = useState('');
    const [countdown, setCountdown] = useState('00:00:00');

    // Video URLs
    const mahakaleshwarVideo = "https://www.youtube.com/watch?v=SyvlfWBCw7I";
    const salasarBalajiVideo = "https://www.youtube.com/watch?v=lW--ukmD8Wc&t=1s";

    // Upcoming Seva data
    const upcomingSevas = [
        {
            title: "Lorem Ipsum",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            date: "01 Jul 25",
            time: "07: 00 AM",
        },
        {
            title: "Lorem Ipsum",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            date: "01 Jul 25",
            time: "07: 00 AM",
        },
        {
            title: "Lorem Ipsum",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            date: "01 Jul 25",
            time: "07: 00 AM",
        },
    ];

    useEffect(() => {
        if (selectedTemple === 'mahakaleshwar') {
            setVideoUrl(mahakaleshwarVideo);
        } else if (selectedTemple === 'salasar') {
            setVideoUrl(salasarBalajiVideo);
        }
    }, [selectedTemple]);

    // Handle button click to change selected temple and video URL
    const handleButtonClick = (temple: string) => {
        setSelectedTemple(temple);
    };

    // Countdown effect
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const nextEvent = new Date();
            nextEvent.setHours(24, 0, 0, 0); // Next midnight
            const distance = nextEvent.getTime() - now;

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full overflow-hidden" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}>
            {/* Background Decorative Images */}
            <div className="absolute inset-0 pointer-events-none">
                <LazyLoadImage
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-4/5 w-auto object-cover opacity-50 hidden lg:block"
                    alt="Left Decoration"
                    src={mand7Png}
                    loading="lazy"
                />
                <LazyLoadImage
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-4/5 w-auto object-cover opacity-50 hidden lg:block"
                    alt="Right Decoration"
                    src={mand7Png}
                    loading="lazy"
                />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Header Section */}
                <div className="text-center mb-4 lg:mb-12">
                    <h2 className="font-marcellus text-[20px] lg:text-[36px] mb-2 font-normal text-white tracking-wide">
                        Live Darshan
                    </h2>

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center py-3 lg:py-2 w-[50%] sm:w-[50%] lg:w-full mx-auto">
                        <div className="flex items-center w-full max-w-md">
                            {/* Left arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="w-2 h-2 bg-white transform rotate-45"></div>
                                <div className="flex-1 h-px bg-white"></div>
                            </div>

                            {/* Center dots with continuous line: small-small-big-small-small */}
                            <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: 'white' }}></div>
                                <div className="w-3 h-px bg-white"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: 'white' }}></div>
                                <div className="w-3 h-px bg-white"></div>
                                <div className="w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: 'white' }}></div>
                                <div className="w-3 h-px bg-white"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: 'white' }}></div>
                                <div className="w-3 h-px bg-white"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: 'white' }}></div>
                            </div>

                            {/* Right arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="flex-1 h-px bg-white"></div>
                                <div className="w-2 h-2 bg-white transform rotate-45"></div>
                            </div>
                        </div>
                    </div>

                    {/* Temple Selection Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <div className="flex flex-row gap-2 w-full justify-center items-center">
                            <button
                                className={`border border-white text-white font-tenor-sans font-normal transition-all duration-300 hover:scale-105
                                    ${selectedTemple === 'mahakaleshwar' ? 'bg-yellow-600 text-white' : 'bg-transparent hover:bg-white hover:text-red-800'}
                                    px-1 py-2 text-[10px] sm:px-3 sm:py-2 sm:text-[12px] lg:px-6 lg:py-3 lg:text-[20px]`}
                                onClick={() => handleButtonClick('mahakaleshwar')}
                            >
                                Shree Mahakaleshwar Mandir
                            </button>
                            <button
                                className={`border border-white text-white font-tenor-sans font-normal transition-all duration-300 hover:scale-105
                                    ${selectedTemple === 'salasar' ? 'bg-yellow-600 text-white' : 'bg-transparent hover:bg-white hover:text-red-800'}
                                    px-1 py-2 text-[10px] sm:px-3 sm:py-2 sm:text-[12px] lg:px-6 lg:py-3 lg:text-[20px]`}
                                onClick={() => handleButtonClick('salasar')}
                            >
                                Shree Salasar Balaji Mandir
                            </button>
                        </div>
                    </div>
                </div>

                {/* Video and Seva Section */}
                <div className="relative">
                    {/* Desktop Layout */}
                    <div className="hidden xl:flex xl:justify-center xl:items-start xl:gap-8 h-[600px]">
                        <VideoPlayerSection
                            selectedTemple={selectedTemple}
                            isDesktop={true}
                        />
                        <div className="flex flex-col gap-2 h-full flex-1 justify-between">
                            <SevaSection isDesktop={true} upcomingSevas={upcomingSevas} />
                            <CountdownTimer countdown={countdown} isDesktop={true} />
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="xl:hidden grid grid-cols-1 gap-6">
                        <div>
                            <VideoPlayerSection
                                selectedTemple={selectedTemple}
                                isDesktop={false}
                            />

                        </div>
                        <SevaSection isDesktop={false} upcomingSevas={upcomingSevas} />
                        <CountdownTimer countdown={countdown} isDesktop={false} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveDarshan;