import { useState, useEffect, useRef } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import mand7Png from "@/assets/images/mand-7.png";
import sevaBg from "@/assets/images/sevabg.png";
import omPng from "@/assets/images/om.png";
// ...existing imports
import { LazyLoadImage } from "react-lazy-load-image-component";
import pujaImageWebp from '@/assets/images/pujaImage.webp';
import { useI18n } from '@/lib/i18n';

// Video Player Component - Reusable for both layouts
const VideoPlayerSection = ({
  selectedTemple,
  isDesktop,
  liveBadgeText,
}: {
  selectedTemple: string;
  isDesktop: boolean;
  liveBadgeText?: string;
}) => {
  return (
    <div className={isDesktop ? "flex-shrink-0 h-full flex-1 flex flex-col " : ""}>
      <div
        className={`relative bg-gray-900 overflow-hidden shadow-2xl rounded-md ${isDesktop ? " h-full" : "rounded-lg"
          }`}
        style={isDesktop ? { height: "100%" } : {}}>
        {/* Video Player */}
        <div className={isDesktop ? "relative w-full h-full" : "relative aspect-video"}>
          {selectedTemple === "mahakaleshwar" && (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/SyvlfWBCw7I?si=MjvSk7Uxks9welTV&controls=1&autoplay=1&mute=1"
              title="Live Darshan Video - Mahakaleshwar"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {selectedTemple === "salasar" && (
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
              <span className="text-sm font-medium">{liveBadgeText ?? 'Live'}</span>
            </div>
          </Badge>

          {/* Volume Control */}
          <button className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.817L4.146 13.04a1 1 0 01-.146-.817V7.777a1 1 0 01.146-.817L8.383 3.076zM14 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1zM16 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Seva Section Component - Reusable for both layouts
const SevaSection = ({
  isDesktop,
  upcomingSevas,
  onViewDetails,
  titleText,
  viewDetailsText,
}: {
  isDesktop: boolean;
  upcomingSevas: Array<{
    title: string;
    description: string;
    date: string;
    time: string;
    image?: string;
  }>;
  onViewDetails: (image?: string, title?: string, description?: string) => void;
  titleText?: string;
  viewDetailsText?: string;
}) => {
  return (
    <div className={isDesktop ? "flex-shrink-0 h-full" : ""}>
      <Card className={`bg-white shadow-lg ${isDesktop ? "h-full flex flex-col" : ""}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <LazyLoadImage
              className="w-10 h-10 object-contain text-red-800"
              alt="Om Symbol"
              src={omPng}
              style={{
                filter:
                  "invert(16%) sepia(97%) saturate(7492%) hue-rotate(353deg) brightness(90%) contrast(98%)",
              }} // ensures red color if SVG, else remove
              loading="lazy"
            />
            <CardTitle className="text-[rgba(139,0,0,1)] font-primaryFont textHeadingLg font-normal">
              {titleText ?? 'Upcoming Events'}
            </CardTitle>
          </div>
          <div className="relative mt-1">
            <div className="h-0.5 bg-red-800 w-full"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-800 rotate-45 rounded-sm"></div>
          </div>
        </CardHeader>

        {/* hide scrollbar for WebKit and set scrollbar styles for other browsers */}
        <CardContent
          className={`${isDesktop ? "flex-1 overflow-y-auto seva-scroll relative" : "relative overflow-hidden"}`}>
          {/* Background image layer with low opacity */}
          <div
            className="absolute inset-0 bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: `url(${sevaBg})`,
              backgroundSize: "90% auto",
              backgroundPosition: "center 60%",
              opacity: 0.07,
            }}
            aria-hidden
          />

          {/* Foreground content */}
          <div className="relative z-10 space-y-4">
            {upcomingSevas.map((seva, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-primaryFont font-normal text-[rgba(76, 41, 30, 1)] textHeading mb-2">
                  {seva.title}
                </h4>
                <p className="font-secondaryFont font-normal text-[rgba(30, 30, 30, 0.5)] textDescription leading-relaxed mb-3">
                  {seva.description}
                </p>
                <div className="flex items-center justify-between font-secondaryFont font-normal text-[#1E1E1E80] textDescription">
                  <div className="flex items-center gap-4 text-[#1E1E1E80]">
                    <div className="flex items-center gap-2  text-[#1E1E1E80] textDescription">
                      {/* calendar icon */}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="whitespace-nowrap">{seva.date}</span>
                    </div>
                    <div className="flex items-center gap-2 textDescription text-[#1E1E1E80]">
                      {/* clock icon */}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="whitespace-nowrap">{seva.time}</span>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="text-[rgba(139,0,0,1)] font-secondaryFont textDescription underline"
                    onClick={(e) => {
                      e.preventDefault();
                      onViewDetails(seva.image, seva.title, seva.description);
                    }}>
                    {viewDetailsText ?? 'View Details'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Countdown Timer Component - Separate component
// const CountdownTimer = ({ countdown }: { countdown: string; isDesktop: boolean }) => {
//   return (
//     <div className={`bg-yellow-600 text-white py-3 px-6 rounded-md `}>
//       <div className="flex items-center justify-between">
//         <span className="font-tenor-sans font-bold textDescription text-white">Countdown Ends In:</span>
//         <span className="font-tenor-sans font-bold textDescription text-white">{countdown}</span>
//       </div>
//     </div>
//   );
// };

const LiveDarshan = (): JSX.Element => {
  const { t } = useI18n();
  const [selectedTemple, setSelectedTemple] = useState<string>("mahakaleshwar");
  const [countdown, setCountdown] = useState("00:00:00");

  // Upcoming Seva data (empty by default)
  const upcomingSevas: { title: string; description: string; date: string; time: string; image?: string }[] = [];

  // determine if upcomingSevas has any meaningful data
  const hasSevas = upcomingSevas.some(
    (seva) => !!(seva && (seva.title || seva.description || seva.date || seva.time || seva.image))
  );

  // Modal state for viewing details image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | undefined>(undefined);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalDescription, setModalDescription] = useState<string | undefined>(undefined);

  const handleOpenModal = (image?: string, title?: string, description?: string) => {
    setModalImage(image);
    setModalTitle(title);
    setModalDescription(description);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage(undefined);
    setModalTitle(undefined);
    setModalDescription(undefined);
  };

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // prevent background scrolling when modal is open
  const prevBodyStyleRef = useRef<{ overflow?: string; paddingRight?: string }>({});
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isModalOpen) {
      // save previous styles
      prevBodyStyleRef.current.overflow = document.body.style.overflow;
      prevBodyStyleRef.current.paddingRight = document.body.style.paddingRight;

      // avoid layout shift by compensating for scrollbar width
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      document.body.style.overflow = "hidden";
    } else {
      // restore previous styles
      document.body.style.overflow = prevBodyStyleRef.current.overflow || "";
      document.body.style.paddingRight = prevBodyStyleRef.current.paddingRight || "";
    }

    // restore on unmount as a safety net
    return () => {
      document.body.style.overflow = prevBodyStyleRef.current.overflow || "";
      document.body.style.paddingRight = prevBodyStyleRef.current.paddingRight || "";
    };
  }, [isModalOpen]);

  // selectedTemple drives the iframe src in VideoPlayerSection directly

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

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "rgba(139, 0, 0, 1)" }}>
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
      <div className="relative z-10 w-full py-8  ">
        {/* Header Section */}
        <div className="text-center mb-4 lg:mb-12">
          <h2
            className="text-5xl md:text-6xl font-bold font-primaryFont"
            style={{
              color: '#fff',
              WebkitTextStroke: '2px #d05e2d',
              textShadow: '0px 2px 4px rgba(139,0,0,0.5), 0px 0.5px 0px #fff',
              letterSpacing: '0.04em',
            }}
          >
            {t('liveDarshan.title')}

          </h2>
          {/* keep countdown value referenced to avoid TS 'declared but never read' */}
          <span className="sr-only">{countdown}</span>

          <div className="flex items-center justify-center py-2 w-full">
            <div className="flex items-center w-full max-w-md">
              {/* Left arrow/diamond with connecting line */}
              <div className="flex items-center flex-1">
                <div className="w-2 h-2 bg-secondaryColor transform rotate-45"></div>
                <div className="flex-1 h-px bg-secondaryColor"></div>
              </div>

              {/* Center dots with continuous line: small-small-big-small-small */}
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                <div className="w-3 h-px bg-secondaryColor"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                <div className="w-3 h-px bg-secondaryColor"></div>
                <div className="w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                <div className="w-3 h-px bg-secondaryColor"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                <div className="w-3 h-px bg-secondaryColor"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
              </div>

              {/* Right arrow/diamond with connecting line */}
              <div className="flex items-center flex-1">
                <div className="flex-1 h-px bg-secondaryColor"></div>
                <div className="w-2 h-2 bg-secondaryColor transform rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Temple Selection Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 lg:pt-8">
            <div className="flex flex-row gap-2 w-full justify-center items-center">
              <button
                className={`border rounded-md border-white text-white font-secondaryFont font-normal 
                                        ${selectedTemple === "mahakaleshwar"
                    ? "bg-yellow-600 text-white"
                    : "bg-transparent hover:bg-white hover:text-red-800"
                  }
                                        px-1 py-2 textDescription sm:px-3 sm:py-2 lg:px-6 lg:py-3 `}
                onClick={() => handleButtonClick("mahakaleshwar")}>
                {t('liveDarshan.buttons.mahakaleshwar')}
              </button>
              <button
                className={`border rounded-md border-white text-white font-secondaryFont font-normal 
                                        ${selectedTemple === "salasar"
                    ? "bg-yellow-600 text-white"
                    : "bg-transparent hover:bg-white hover:text-red-800"
                  }
                                        px-1 py-2 textDescription sm:px-3 sm:py-2  lg:px-6 lg:py-3 `}
                onClick={() => handleButtonClick("salasar")}>
                {t('liveDarshan.buttons.salasar')}
              </button>
            </div>
          </div>
        </div>

        {/* Video and Seva Section */}
        <div >
          {/* Desktop Layout */}
          <div className="hidden xl:flex xl:justify-center xl:items-stretch gap-4 h-[600px] max-w-full mx-36 ">
            {/* When there's no meaningful seva data, let the video take full width */}
            <div className={"h-full flex flex-col " + (hasSevas ? "w-[73%]" : "w-full")}>
              <VideoPlayerSection selectedTemple={selectedTemple} isDesktop={true} liveBadgeText={t('liveDarshan.liveBadge')} />
            </div>

            {hasSevas && (
              <div className="flex flex-col gap-2 w-[38%] h-[600px]">
                <SevaSection isDesktop={true} upcomingSevas={upcomingSevas} onViewDetails={handleOpenModal} titleText={t('liveDarshan.upcomingEventsTitle')} viewDetailsText={t('liveDarshan.viewDetails')} />
                {/* <CountdownTimer countdown={countdown} isDesktop={true} /> */}
              </div>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="xl:hidden grid grid-cols-1 gap-6 mx-4">
            <div>
              <VideoPlayerSection selectedTemple={selectedTemple} isDesktop={false} liveBadgeText={t('liveDarshan.liveBadge')} />
            </div>
            {hasSevas && (
              <SevaSection isDesktop={false} upcomingSevas={upcomingSevas} onViewDetails={handleOpenModal} titleText={t('liveDarshan.upcomingEventsTitle')} viewDetailsText={t('liveDarshan.viewDetails')} />
            )}
            {/* <CountdownTimer countdown={countdown} isDesktop={false} /> */}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          aria-modal="true"
          role="dialog">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          {/* Modal panel */}
          <div className="relative z-10 w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b">
              <h3 className="textHeadingLg font-primaryFont font-semibold text-[#333]">{t('liveDarshan.modal.upcomingEvent')}</h3>
              <button
                aria-label="Close"
                onClick={handleCloseModal}
                className="ml-4 p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="w-full">
              <LazyLoadImage
                src={modalImage || pujaImageWebp}
                alt={modalTitle || 'event'}
                className="w-full h-44 object-cover bg-cover rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="">
              <h4 className="text-[rgba(139,0,0,1)] textHeading font-primaryFont mb-3">{modalTitle || t('liveDarshan.modal.eventFallback')}</h4>
              <p className="textDescription text-[#444] leading-relaxed mb-3">
                {modalDescription || t('liveDarshan.modal.noDescription')}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LiveDarshan;
