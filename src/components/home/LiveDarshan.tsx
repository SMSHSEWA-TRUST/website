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
import { useGetEvents } from '@/api/EventsQueries';
import type { EventItem } from '@/services/events.service';




// Video Player Component - Reusable for both layouts
const VideoPlayerSection = ({
  selectedTemple,
  isDesktop,
  liveBadgeText,
  liveVideoUrls,
}: {
  selectedTemple: string;
  isDesktop: boolean;
  liveBadgeText?: string;
  liveVideoUrls?: { [key: string]: string };
}) => {
  // derive video src from liveVideoUrls mapping; fall back to previous hardcoded urls
  const fallbackUrls: { [k: string]: string } = {
    'Mahakaleshwar': 'https://www.youtube.com/embed/SyvlfWBCw7I?si=MjvSk7Uxks9welTV&controls=1&autoplay=1&mute=1',
    'Salasar Balaji': 'https://www.youtube.com/embed/lW--ukmD8Wc?si=sXMi9WppuEPEX83C&controls=1&autoplay=1&mute=1',
  };

  const videoSrc = (liveVideoUrls && liveVideoUrls[selectedTemple]) || fallbackUrls[selectedTemple];

  return (
    <div className={isDesktop ? "flex-shrink-0 h-full flex-1 flex flex-col " : ""}>
      <div
        className={`relative bg-gray-900 overflow-hidden shadow-2xl rounded-md ${isDesktop ? " h-full" : "rounded-lg"
          }`}
        style={isDesktop ? { height: "100%" } : {}}>
        {/* Video Player */}
        <div className={isDesktop ? "relative w-full h-full" : "relative aspect-video"}>
          {videoSrc ? (
            <iframe
              className="w-full h-full"
              src={videoSrc}
              title={`Live Darshan Video - ${selectedTemple}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : null}

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
}:

  {
    isDesktop: boolean;
    upcomingSevas: Array<{
      title: string;
      description: string;
      date: string;
      time: string;
      image?: string;
    }>;
    onViewDetails: (image?: string, title?: string, description?: string, date?: string, time?: string) => void;
    titleText?: string;
    viewDetailsText?: string;



  }) => {

  function truncateByChars(sentence: any, maxLength: number) {
    if (!sentence || typeof sentence !== "string") return "";
    if (sentence.length <= maxLength) return sentence;
    return sentence.slice(0, maxLength).trim() + "...";
  }

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

          {/* Foreground content - allow scrolling on smaller screens when content overflows */}
          <div className={`relative z-10 space-y-4 ${isDesktop ? '' : 'max-h-[40vh] sm:max-h-[50vh] overflow-y-auto'}`}>
            {upcomingSevas.map((seva, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-primaryFont font-normal text-[rgba(76, 41, 30, 1)] textHeading mb-2">
                  {seva.title}
                </h4>
                <p className="font-secondaryFont font-normal text-[rgba(30, 30, 30, 0.5)] textDescription leading-relaxed mb-3">
                  {truncateByChars(seva.description, 100)}
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
                      {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="whitespace-nowrap">{seva.time}</span> */}
                    </div>
                  </div>

                  <a
                    href="#"
                    className="text-[rgba(139,0,0,1)] font-secondaryFont textDescription underline"
                    onClick={(e) => {
                      e.preventDefault();
                      onViewDetails(seva.image, seva.title, seva.description, seva.date, seva.time);
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
  const [selectedTemple, setSelectedTemple] = useState<string>("Mahakaleshwar");
  const [countdown, setCountdown] = useState("00:00:00");
  const [liveVideoUrls, setLiveVideoUrls] = useState<{ [key: string]: string }>({});



  // Upcoming Seva data (comes from API)
  const [upcomingSevas, setUpcomingSevas] = useState<{
    title: string;
    description: string;
    date: string;
    time: string;
    image?: string;
  }[]>([]);

  // fetch events from API using React Query
  const { data: eventsData, } = useGetEvents(selectedTemple);

  // Fetch live video URLs from API and map to temples
  useEffect(() => {
    let mounted = true;
    const normalizeYouTubeUrl = (raw?: string) => {
      if (!raw) return '';
      try {
        const trimmed = raw.trim();

        // If it's already an embed URL, ensure params exist
        if (/youtube\.com\/embed\//i.test(trimmed)) {
          if (/[?&](autoplay|controls|mute)=/i.test(trimmed)) return trimmed;
          return trimmed + (trimmed.includes('?') ? '&' : '?') + 'controls=1&autoplay=1&mute=1';
        }

        // Direct live URL: /live/VIDEOID (e.g. https://www.youtube.com/live/5pa56mf9ba4?si=...)
        const liveMatch = trimmed.match(/youtube\.com\/live\/([^?&/]+)/i);
        if (liveMatch && liveMatch[1]) {
          return `https://www.youtube.com/embed/${liveMatch[1]}?controls=1&autoplay=1&mute=1`;
        }

        // Shorts URL: /shorts/VIDEOID -> embed
        const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&/]+)/i);
        if (shortsMatch && shortsMatch[1]) {
          return `https://www.youtube.com/embed/${shortsMatch[1]}?controls=1&autoplay=1&mute=1`;
        }

        // If it's a watch URL like https://www.youtube.com/watch?v=VIDEOID
        const watchMatch = trimmed.match(/[?&]v=([^&]+)/);
        if (watchMatch && watchMatch[1]) {
          return `https://www.youtube.com/embed/${watchMatch[1]}?controls=1&autoplay=1&mute=1`;
        }

        // If it's a short youtu.be link
        const shortMatch = trimmed.match(/youtu\.be\/([^?&/]+)/i);
        if (shortMatch && shortMatch[1]) {
          return `https://www.youtube.com/embed/${shortMatch[1]}?controls=1&autoplay=1&mute=1`;
        }

        // Last resort: parse URL and try to extract a sensible id from the pathname
        try {
          const u = new URL(trimmed);
          const host = (u.hostname || '').toLowerCase();

          // youtu.be/<id>
          if (host.includes('youtu.be')) {
            const id = u.pathname.replace(/^\//, '').split('/')[0];
            if (id) return `https://www.youtube.com/embed/${id}?controls=1&autoplay=1&mute=1`;
          }

          // youtube.com/* -> take the last path segment as a fallback id (covers several patterns)
          if (host.includes('youtube.com')) {
            const parts = u.pathname.split('/').filter(Boolean);
            const last = parts[parts.length - 1];
            if (last) return `https://www.youtube.com/embed/${last}?controls=1&autoplay=1&mute=1`;
          }
        } catch (e) {
          // ignore parse errors
        }

        // Unknown format: return as-is (iframe may fail) but still prefer trimmed value
        return trimmed;
      } catch (e) {
        return raw || '';
      }
    };
    const fetchVideos = async () => {
      try {
        const res = await fetch('https://api.smshsewatrust.com/api/liveVideos/');
        if (!res.ok) throw new Error('Failed to fetch live videos');
        const json = await res.json();
        const arr = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);

        // Build mapping by reading scheduledPlace/title/description first (robust, case-insensitive).
        // Only fall back to positional mapping if no explicit place info is available.
        const urls: { [key: string]: string } = {};

        // First pass: map items that mention the place explicitly in scheduledPlace/title/description
        arr.forEach((it: any) => {
          const fields = [it?.scheduledPlace, it?.title, it?.description]
            .filter(Boolean)
            .map((s: any) => String(s).toLowerCase())
            .join(' ');
          const video = normalizeYouTubeUrl(it?.videoUrl);
          if (!video) return;

          if (fields.includes('salasar') || fields.includes('balaji')) {
            if (!urls['Salasar Balaji']) urls['Salasar Balaji'] = video;
            return;
          }

          if (fields.includes('mahakaleshwar') || fields.includes('mahakal')) {
            if (!urls['Mahakaleshwar']) urls['Mahakaleshwar'] = video;
            return;
          }
        });

        // Second pass: try looser matching (title/description if not matched above)
        if ((!urls['Salasar Balaji'] || !urls['Mahakaleshwar']) && arr.length > 0) {
          arr.forEach((it: any) => {
            const text = [it?.title, it?.description, it?.scheduledPlace].filter(Boolean).join(' ').toLowerCase();
            const video = normalizeYouTubeUrl(it?.videoUrl);
            if (!video) return;
            if (!urls['Salasar Balaji'] && text.includes('salasar')) urls['Salasar Balaji'] = video;
            if (!urls['Mahakaleshwar'] && text.includes('mahakaleshwar')) urls['Mahakaleshwar'] = video;
          });
        }

        // Last resort: if still missing and we have at least two items, use positional mapping
        if (arr.length >= 2) {
          if (!urls['Salasar Balaji']) urls['Salasar Balaji'] = normalizeYouTubeUrl(arr[0]?.videoUrl);
          if (!urls['Mahakaleshwar']) urls['Mahakaleshwar'] = normalizeYouTubeUrl(arr[1]?.videoUrl);
        } else if (arr.length === 1) {
          const item = arr[0];
          const place = String(item?.scheduledPlace || '').toLowerCase();
          if (place.includes('salasar') || place.includes('balaji')) urls['Salasar Balaji'] = normalizeYouTubeUrl(item.videoUrl);
          else if (place.includes('mahakaleshwar') || place.includes('mahakal')) urls['Mahakaleshwar'] = normalizeYouTubeUrl(item.videoUrl);
        }

        if (mounted) setLiveVideoUrls(urls);
      } catch (err) {
        // ignore - keep fallbacks in the player
        console.error('Failed to load live videos', err);
      }
    };

    fetchVideos();
    return () => { mounted = false; };
  }, []);

  // map API response to the shape used by SevaSection
  useEffect(() => {
    if (!eventsData) return;

    // eventsData is expected to be the backend response body. If the service returns an object with `data` field,
    // try to normalize it. We'll handle both shapes: array or { data: [...] }

    const maybe: any = eventsData;
    let items: EventItem[] = [];
    if (Array.isArray(maybe)) {
      items = maybe as EventItem[];
    } else if (Array.isArray(maybe?.data)) {
      items = maybe.data as EventItem[];
    } else if (Array.isArray(maybe?.events)) {
      items = maybe.events as EventItem[];
    }


    const formatTime = (iso?: string) => {
      if (!iso) return "";
      try {
        const d = new Date(iso);
        return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      } catch {
        return "";
      }
    };

    const mapped = items.map((it) => {
      // fallback date source
      const created = it.createdAt || it.created_at || it.date || it.eventDate;

      // scheduleDate split
      const scheduleDate = it.scheduleDate ? new Date(it.scheduleDate) : null;
      const formattedDate = scheduleDate
        ? scheduleDate.toISOString().split("T")[0] // yyyy-mm-dd
        : "";

      const formattedTime = scheduleDate
        ? scheduleDate.toISOString().split("T")[1].split(".")[0] // hh:mm:ss
        : (created ? formatTime(created) : (it.time || it.eventTime || ""));

      return {
        title: it.title || it.name || "",
        description: it.description || it.summary || "",
        date: formattedDate,
        time: formattedTime,
        image: it.imageUrl || it.image || it.image_path || undefined,
        id: it._id || it.id,
      };
    });


    setUpcomingSevas(mapped);
  }, [eventsData]);

  // determine if upcomingSevas has any meaningful data
  const hasSevas = upcomingSevas.some(
    (seva) => !!(seva && (seva.title || seva.description || seva.date || seva.time || seva.image))
  );

  // Modal state for viewing details image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | undefined>(undefined);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalDescription, setModalDescription] = useState<string | undefined>(undefined);
  const [modalDate, setModalDate] = useState<string | undefined>(undefined);

  const handleOpenModal = (
    image?: string,
    title?: string,
    description?: string,
    date?: string
  ) => {
    setModalImage(image);
    setModalTitle(title);
    setModalDescription(description);
    setModalDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage(undefined);
    setModalTitle(undefined);
    setModalDescription(undefined);
    setModalDate(undefined);
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
        {/* Desktop decorations (unchanged) */}
        <LazyLoadImage
          className="absolute left-[-20%] top-[60%] -translate-y-1/2 w-[715px] object-cover opacity-2 hidden lg:block"
          alt="Left Decoration"
          src={mand7Png}
          loading="lazy"
        />
        <LazyLoadImage
          className="absolute right-[-20%] top-[60%] -translate-y-1/2 w-[715px]  object-cover opacity-2 hidden lg:block"
          alt="Right Decoration"
          src={mand7Png}
          loading="lazy"
        />

        {/* Mobile decorations: subtle, smaller, and positioned for small screens only (visible < lg) */}
        <LazyLoadImage
          className="block lg:hidden absolute left-[-10%] top-[12%] w-[220px] object-cover opacity-10"
          alt="Mobile Left Decoration"
          src={mand7Png}
          loading="lazy"
        />
        <LazyLoadImage
          className="block lg:hidden absolute right-[-10%] bottom-[6%] w-[200px] object-cover opacity-12"
          alt="Mobile Right Decoration"
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
                                        ${selectedTemple === "Mahakaleshwar"
                    ? "bg-yellow-600 text-white"
                    : "bg-transparent hover:bg-white hover:text-red-800"
                  }
                                        px-1 py-2 textDescription sm:px-3 sm:py-2 lg:px-6 lg:py-3 `}
                onClick={() => handleButtonClick("Mahakaleshwar")}>
                {t('liveDarshan.buttons.mahakaleshwar')}
              </button>
              <button
                className={`border rounded-md border-white text-white font-secondaryFont font-normal 
                                        ${selectedTemple === "Salasar Balaji"
                    ? "bg-yellow-600 text-white"
                    : "bg-transparent hover:bg-white hover:text-red-800"
                  }
                                        px-1 py-2 textDescription sm:px-3 sm:py-2  lg:px-6 lg:py-3 `}
                onClick={() => handleButtonClick("Salasar Balaji")}>
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
              <VideoPlayerSection selectedTemple={selectedTemple} isDesktop={true} liveBadgeText={t('liveDarshan.liveBadge')} liveVideoUrls={liveVideoUrls} />
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
              <VideoPlayerSection selectedTemple={selectedTemple} isDesktop={false} liveBadgeText={t('liveDarshan.liveBadge')} liveVideoUrls={liveVideoUrls} />
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
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-6 overflow-y-auto"
          aria-modal="true"
          role="dialog">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          {/* Modal panel - cap height and allow internal scrolling on small/tablet */}
          <div className="relative z-10 w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl  p-2 lg:p-6 flex flex-col gap-2 ">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h3 className="text-2xl font-primaryFont font-semibold text-[#111]">{modalTitle || t('liveDarshan.modal.upcomingEvent')}</h3>
              <button
                aria-label="Close"
                onClick={handleCloseModal}
                className="ml-4 p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image - larger */}
            <div className="w-full">
              <LazyLoadImage
                src={modalImage || pujaImageWebp}
                alt={modalTitle || 'event'}
                className="w-full h-44 md:h-56 lg:h-64 object-cover bg-cover rounded-2xl"
              />
            </div>

            {/* Puja heading */}
            <div>
              <h4 className="text-[rgba(139,0,0,1)] text-2xl font-primaryFont mb-2">{modalTitle || t('liveDarshan.modal.eventFallback')}</h4>
            </div>

            {/* Date/Time Row */}
            <div className="flex items-center gap-1 text-[#666]">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#a0a0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-sm">{modalDate || ''}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#a0a0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">{modalTime || ''}</span>
              </div> */}
            </div>
            {/* horizontal divider directly after time (matches design) */}
            <div className="w-full h-[1px] bg-[#a9331f] my-2" aria-hidden />

            {/* Description */}
            <div className="text-sm text-[#444] leading-relaxed max-h-[300px] overflow-y-auto">
              <p className="mb-3">{modalDescription || t('liveDarshan.modal.noDescription')}</p>


            </div>

            {/* CTA */}
            <div className="mt-2">
              <button className="w-full bg-[#a9331f] text-white py-3 rounded-md" onClick={handleCloseModal}>{t('liveDarshan.modal.cta') || 'Close'}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LiveDarshan;
