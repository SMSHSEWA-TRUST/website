import { useState, useEffect, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import tempLogo from "@/assets/images/temp-logo.png";
import lineImage from "@/assets/images/line.png";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "../ui/navigation-menu";
import { useI18n } from "@/lib/i18n";
import LogoutIcon from "@/assets/images/logOutLogo.png";
// Cart modal replaced by full-page checkout navigation
import { useGetCart } from "@/api/CartQueries";

const Header = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  // Fetch cart data to get cart item count (only when logged in)
  const { data: cartData } = useGetCart();

  // Get cart item count from either CartPreviewData or CartData structure
  const cartItemCount = (() => {
    if (!cartData?.data) return 0;
    // Check if it's CartPreviewData structure with nested cart
    if ('cart' in cartData.data && cartData.data.cart?.items) {
      return cartData.data.cart.items.length;
    }
    // Check if it's CartData structure with direct items
    if ('items' in cartData.data && cartData.data.items) {
      return cartData.data.items.length;
    }
    return 0;
  })();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const { t, lang, setLang } = useI18n();
  const marqueeWrapperRef = useRef<HTMLDivElement | null>(null);
  const langSelectorRef = useRef<HTMLDivElement | null>(null);
  // user menu state & refs (separate refs for desktop and mobile to avoid ref overwrite)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuDesktopRef = useRef<HTMLDivElement | null>(null);
  const userMenuMobileRef = useRef<HTMLDivElement | null>(null);

  // derive user name from localStorage if available and keep it reactive
  const [userName, setUserName] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw as string) as any;
        return parsed?.name || parsed?.fullName || parsed?.username || localStorage.getItem("userName") || "User";
      }
    } catch (e) {
      // ignore parse errors
    }
    return localStorage.getItem("userName") || "User";
  });

  // Keep header name updated when localStorage changes (other tabs) or we dispatch a custom event (same tab)
  useEffect(() => {
    const updateFromStorageValue = () => {
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw as string) as any;
          setUserName(parsed?.name || parsed?.fullName || parsed?.username || localStorage.getItem('userName') || 'User');
          return;
        }
      } catch (err) {
        // fall through
      }
      setUserName(localStorage.getItem('userName') || 'User');
    };

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'user' || e.key === 'userName') {
        updateFromStorageValue();
      }
    };

    const onUserUpdated = (ev: Event) => {
      // Custom event detail contains updated user object
      const detail = (ev as CustomEvent).detail;
      if (detail && detail.name) {
        setUserName(detail.name);
        return;
      }
      // fallback to reading localStorage
      updateFromStorageValue();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('userUpdated', onUserUpdated as EventListener);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('userUpdated', onUserUpdated as EventListener);
    };
  }, []);

  // Mobile language dropdown state
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  // Close language menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!isLangMenuOpen) return;
      const target = e.target as Node | null;
      if (langMenuRef.current && target && !langMenuRef.current.contains(target)) {
        setIsLangMenuOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLangMenuOpen(false);
    };

    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isLangMenuOpen]);

  // Close user menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!isUserMenuOpen) return;
      const target = e.target as Node | null;

      const clickInsideDesktop = userMenuDesktopRef.current && target && userMenuDesktopRef.current.contains(target);
      const clickInsideMobile = userMenuMobileRef.current && target && userMenuMobileRef.current.contains(target);

      if (!clickInsideDesktop && !clickInsideMobile) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };

    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isUserMenuOpen]);

  // Ensure marquee doesn't overlap the language selector: measure right-side width and add padding to marquee wrapper
  useEffect(() => {
    const updatePadding = () => {
      const langEl = langSelectorRef.current;
      const marqueeEl = marqueeWrapperRef.current;
      if (!marqueeEl) return;
      const langWidth = langEl ? langEl.offsetWidth : 0;
      const dividerExtra = 12; // px for divider + spacing
      marqueeEl.style.paddingRight = `${langWidth + dividerExtra}px`;
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, [lang]);

  // Auto-hide header state
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;

    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      setIsScrolled(currentY > 10);

      if (!ticking) {
        window.requestAnimationFrame(() => {

          if (currentY > lastScrollY.current && currentY > 200) {
            setIsHidden(true);
          }
          // Show header if scrolling up OR if near the top of the page
          else if (currentY < lastScrollY.current || currentY <= 150) {
            setIsHidden(false);
          }

          lastScrollY.current = currentY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const NavItems = [
    {
      name: "home",
      link: "/",
    },
    {
      name: "about",
      link: "/about",
    },
    {
      name: "puja",
      link: "/puja",
    },
    {
      name: "gallery",
      link: "/gallery",
    },
    {
      name: "prashad",
      link: "/prashad",
    },
    {
      name: "membership",
      link: "/membership",
    },
    {
      name: "blogs",
      link: "/blogs",
    },
    {
      name: "contact",
      link: "/contact",
    },
  ]
  return (
    <header
      className={`w-full top-0 fixed left-0 right-0 z-50 font-secondaryFont transform transition-transform duration-300 ${isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      aria-hidden={isHidden}
      style={{ boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.08)" : undefined }}
    >
      {/* Top Red Bar (visible on all sizes, but layout adapts) */}
      <div className="bg-[#8b0000] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            {/* Left: fixed label (start of marquee) */}
            <div className="flex-shrink-0 mr-4 textDescription hidden sm:block">
              <span className="font-medium text-sm"> महामृत्युंजय मंत्र:</span>
            </div>

            {/* Center: marquee fills available space between left label and right selector */}
            <div className="flex-1 min-w-0 flex items-center">
              {/* Marquee container: CSS keyframes used for smooth, accessible scrolling. */}
              <div className="overflow-hidden w-full" ref={marqueeWrapperRef}>
                <div
                  className="marquee flex items-center whitespace-nowrap"
                  aria-label="ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् "
                  role="region"
                >
                  {/* Make marquee twice the viewport width; each group takes 50% so animation moves full width to reach right edge */}
                  {/* Primary marquee group (always rendered) */}
                  <div className="marquee-group flex items-center gap-6 pr-8" style={{ width: '50%' }}>
                    <span>ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् </span>
                  </div>

                  {/* Duplicate group: render visually only on widths >= 960px so desktop shows text twice, mobile/tablet shows once */}
                  <div className="marquee-group marquee-duplicate flex items-center gap-6 pr-8" aria-hidden="true" style={{ width: '50%' }}>
                    <span className="flex items-center gap-1 text">
                      <span>ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Vertical divider between marquee and language selector */}
              <div className="mx-4 h-6 w-px bg-white/60" aria-hidden="true" />

            </div>

            {/* Inline styles for marquee animation scoped to this file */}
            <style>{`
              .marquee {
                display: inline-flex;
                will-change: transform;
                /* marquee occupies 200% width so it can scroll fully across the center space */
                width: 200%;
                /* Scroll direction changed: animate content leftwards so the visible text moves from right -> left (RTL visual flow). */
                animation: marquee-anim 16s linear infinite;
                /* allow pausing on hover/focus for accessibility */
                animation-play-state: running;
              }

              .marquee-group {
                display: inline-flex;
                align-items: center;
              }

              @keyframes marquee-anim {
                /* Move content from right to left: start at 0% and translate to -50% so text flows leftwards across the visible area */
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }

              .marquee:hover, .marquee:focus-within {
                animation-play-state: paused;
              }
              /* ensure marquee content doesn't force the flex item to grow */
              .marquee, .marquee-group { flex-shrink: 0; }

              /* make sure the divider stays visible and marquee doesn't overlap */
              .marquee { padding-right: 12px; }

              /* For widths less than 960px show single copy: adjust animation and hide duplicate */
              @media (max-width: 959px) {
                /* Mobile: use single-copy marquee and animate right-to-left across full width */
                .marquee { width: 100%; animation: marquee-anim-mobile 12s linear infinite; }
                @keyframes marquee-anim-mobile {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                /* hide duplicate on small/medium screens */
                .marquee-duplicate { display: none; }
              }

              /* For widths 960px and up, we keep width 200% and show duplicate so text appears twice during scroll */
              @media (min-width: 960px) {
                .marquee { width: 250%; animation: marquee-anim 16s linear infinite; }
                .marquee-duplicate { display: inline-flex; }
              }

              /* reduce motion for users who prefer reduced motion */
              @media (prefers-reduced-motion: reduce) {
                .marquee { animation: none; }
              }
            `}</style>
            <div className="flex items-center gap-2 textDescription" ref={langSelectorRef}>
              <span className="hidden sm:inline">{t("header.language")}</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                // use mobile-like styling on large screens so selected text (eg. Hindi) isn't clipped
                className="bg-[#AD2F16] border border-white/30 rounded px-3 py-1 text-white text-xs sm:text-sm appearance-none"
                style={{ minHeight: 32, lineHeight: '1.4rem' }}
              >
                <option value="en" className="text-black">
                  English
                </option>
                <option value="hi" className="text-black">
                  हिंदी
                </option>
                <option value="gu" className="text-black">
                  ગુજરાતી
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" aria-label="Home">
                <LazyLoadImage
                  className="w-20 h-20 object-cover"
                  alt="Temple Logo"
                  src={tempLogo}
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Center Content - Title */}
            <div className="flex flex-col items-center flex-1">
              {/* Title */}
              <h1 className="font-primaryFont text-center mb-2 text-[34px] font-normal text-[#4c291e] [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#8b0000] leading-tight">
                {t("header.title")}
              </h1>

              {/* Decorative Line */}
              <div className="relative mb-2 mt-2">
                <div className="relative w-full max-w-4xl h-3">
                  <LazyLoadImage
                    className="w-full h-3 object-cover"
                    alt="Decorative Line"
                    src={lineImage}
                    loading="lazy"
                  />
                  <div className="absolute w-3 h-3 top-0 left-1/2 transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                  <div className="absolute w-2 h-2 top-0.5 left-[calc(50%+12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                  <div className="absolute w-2 h-2 top-0.5 left-[calc(50%-12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                  <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%+24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                  <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%-24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                  <div className="absolute w-3 h-3 top-0 left-0 bg-secondaryColor rounded-full" />
                  <div className="absolute w-3 h-3 top-0 right-0 bg-secondaryColor rounded-full" />
                </div>
              </div>
            </div>

            {/* Register/Login or Logout Button with Cart Icon */}
            {isLoggedIn ? (
              <div className="flex-shrink-0 flex items-center gap-3">
                {/* User Menu */}
                <div className="relative" ref={userMenuDesktopRef}>
                  <button
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                    onClick={() => setIsUserMenuOpen((s) => !s)}
                    className="flex items-center gap-3 bg-[#8b0000] text-white rounded-full px-3 py-2 shadow-sm cursor-pointer"
                  >
                    {/* user icon */}
                    <div className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center text-white" aria-hidden>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* label - show on md+ as in screenshot */}
                    <div className="hidden md:flex flex-col text-left leading-none">
                      <span className="text-sm font-medium text-white ">{userName}</span>
                    </div>

                    {/* chevron - white */}
                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path d="M6 8l4 4 4-4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl z-50 border-gray-100 overflow-hidden grid transition-all duration-300 ease-out ${isUserMenuOpen ? "grid-rows-[1fr] py-3 opacity-100 border" : "grid-rows-[0fr] py-0 opacity-0 border-none"}`}
                    role="menu"
                  >
                    {/* Inner wrapper required for grid animation */}
                    <div className="min-h-0">
                      <div className="px-3 space-y-1">

                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} role="menuitem" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-gray-50">
                          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-gray-700 text-base">{t("profile.personalProfile")}</span>
                        </Link>

                        <Link to="/puja-bookings" onClick={() => setIsUserMenuOpen(false)} role="menuitem" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-gray-50">
                          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 3v4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 3v4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-gray-700 text-base">{t("profile.pujaBookings")}</span>
                        </Link>

                        <Link to="/prashad-order-history" onClick={() => setIsUserMenuOpen(false)} role="menuitem" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-gray-50">
                          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 16l5-5 5 5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-gray-700 text-base">{t("profile.prashadOrders")}</span>
                        </Link>

                        <Link to="/donations-history" onClick={() => setIsUserMenuOpen(false)} role="menuitem" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-gray-50">
                          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 8v8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 6H8v4H6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-gray-700 text-base">{t("profile.donationsHistory")}</span>
                        </Link>

                        <Link to="/membership-history" onClick={() => setIsUserMenuOpen(false)} role="menuitem" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-gray-50">
                          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="4" width="18" height="14" rx="2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 2v4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-gray-700 text-base">{t("profile.membershipHistory")}</span>
                        </Link>

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              localStorage.clear();
                              window.location.reload();
                            }}
                            className="w-full bg-[#8b0000] text-white py-2 rounded-md flex items-center justify-center gap-2"
                          >
                            <img src={LogoutIcon} alt="Logout" className="w-6 h-6 object-contain" />
                            <span className="text-white font-medium">{t("auth.logout")}</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Cart Icon */}
                <button
                  onClick={() => navigate('/checkout')}
                  // Added 'group' here to trigger the child animation on hover
                  className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="View cart"
                >
                  {/* Inline style for the custom draw animation (No config needed) */}
                  <style>{`
                      @keyframes draw {
                        0% { stroke-dashoffset: 100; }
                        100% { stroke-dashoffset: 0; }
                      }`}
                  </style>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // Matches your original sizing and color
                    className="w-6 h-6 text-[#8b0000]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      // stroke-current uses the text-[#8b0000] from parent
                      // [animation:...] calls the keyframes defined in the style tag above
                      className="stroke-current stroke-[1.5] [stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-300 group-hover:stroke-[2] group-hover:[animation:draw_0.5s_ease-in_forwards]"
                      d="M2.75012 3.24989L4.83012 3.60989L5.79312 15.0829C5.87012 16.0199 6.65312 16.7389 7.59312 16.7359H18.5021C19.3991 16.7379 20.1601 16.0779 20.2871 15.1899L21.2361 8.63189C21.3421 7.89889 20.8331 7.21889 20.1011 7.11289C20.0371 7.10389 5.16412 7.09889 5.16412 7.09889"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="stroke-current stroke-[1.5] [stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-300 group-hover:stroke-[2] group-hover:[animation:draw_0.5s_ease-in_forwards]"
                      d="M14.1251 10.7948H16.8981"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="stroke-current stroke-[1.5] [stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-300 group-hover:stroke-[2] group-hover:[animation:draw_0.5s_ease-in_forwards]"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.15441 20.2025C7.45541 20.2025 7.69841 20.4465 7.69841 20.7465C7.69841 21.0475 7.45541 21.2915 7.15441 21.2915C6.85341 21.2915 6.61041 21.0475 6.61041 20.7465C6.61041 20.4465 6.85341 20.2025 7.15441 20.2025Z"
                      // Fill is set to current color to match the stroke
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="stroke-current stroke-[1.5] [stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-300 group-hover:stroke-[2] group-hover:[animation:draw_0.5s_ease-in_forwards]"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.4347 20.2025C18.7357 20.2025 18.9797 20.4465 18.9797 20.7465C18.9797 21.0475 18.7357 21.2915 18.4347 21.2915C18.1337 21.2915 17.8907 21.0475 17.8907 20.7465C17.8907 20.4465 18.1337 20.2025 18.4347 20.2025Z"
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex-shrink-0">
                <Link to="/login">
                  <Button className="font-secondaryFont bg-[#8b0000] hover:bg-[#660000] text-white px-4 py-2 textDescription font-normal">
                    {t("auth.register")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Width Navigation Menu Bar */}
      <div className="w-full hidden lg:block" style={{ backgroundColor: 'rgba(173, 47, 22, 1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1">
            {/* Left spacer to align with logo */}
            <div className="w-20"></div>

            {/* Center Navigation Menu */}
            <NavigationMenu className="flex-1">
              <NavigationMenuList className="flex items-center gap-4 xl:gap-6 2xl:gap-8 w-full justify-center text-[22px]">
                {NavItems.map((item) => (
                  <NavigationMenuItem key={item.link}>
                    <Link to={item.link}>
                      <Button
                        variant="link"
                        className={`rounded-none pl-0 font-secondaryFont font-normal no-underline hover:no-underline  bg-gradient-to-r from-white to-white bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-in-out
  ${currentPath === item.link
                            ? "text-white bg-[length:90%_2px]"
                            : "text-white/90 hover:text-white bg-[length:0%_2px] hover:bg-[length:90%_2px]"
                          }`}
                      >
                        {t(`nav.${item.name}`)}
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                ))}

              </NavigationMenuList>
            </NavigationMenu>

            {/* Right spacer to align with register/login button */}
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout */}
      <div className="lg:hidden">
        {/* Mobile Header Bar with Title Centered */}
        <div className="bg-white">
          <div className="flex items-center justify-between py-4 px-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" aria-label="Home">
                <LazyLoadImage
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover"
                  alt="Temple Logo"
                  src={tempLogo}
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Centered Title */}
            <div className="flex-1 flex justify-center px-2 sm:px-4">
              <h1 className="font-primaryFont text-center text-[17px] text-[#4c291e] [text-shadow:0px_2px_2px_#daa52040] [-webkit-text-stroke:0.3px_#8b0000] leading-tight font-semibold max-w-xs sm:max-w-sm">
                {t("header.title")}
              </h1>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Cart Icon for Mobile */}
              {isLoggedIn && (
                <button
                  onClick={() => navigate('/checkout')}
                  // Added 'group' here to trigger the child animation on hover
                  className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="View cart"
                >
                  {/* Inline style for the custom draw animation (No config needed) */}
                  <style>{`
                      @keyframes draw {
                        0% { stroke-dashoffset: 100; }
                        100% { stroke-dashoffset: 0; }
                      }`}
                  </style>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // Matches your original sizing and color
                    className="w-6 h-6 text-[#8b0000]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      // stroke-current uses the text-[#8b0000] from parent
                      // [animation:...] calls the keyframes defined in the style tag above
                      className="stroke-current stroke-[1.5] [stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-300 group-hover:stroke-[2] group-hover:[animation:draw_0.5s_ease-in_forwards]"
                      d="M2.75012 3.24989L4.83012 3.60989L5.79312 15.0829C5.87012 16.0199 6.65312 16.7389 7.59312 16.7359H18.5021C19.3991 16.7379 20.1601 16.0779 20.2871 15.1899L21.2361 8.63189C21.3421 7.89889 20.8331 7.21889 20.1011 7.11289C20.0371 7.10389 5.16412 7.09889 5.16412 7.09889"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="stroke-current stroke-[1.5] [stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-300 group-hover:stroke-[2] group-hover:[animation:draw_0.5s_ease-in_forwards]"
                      d="M14.1251 10.7948H16.8981"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="stroke-current stroke-[1.5] [stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-300 group-hover:stroke-[2] group-hover:[animation:draw_0.5s_ease-in_forwards]"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.15441 20.2025C7.45541 20.2025 7.69841 20.4465 7.69841 20.7465C7.69841 21.0475 7.45541 21.2915 7.15441 21.2915C6.85341 21.2915 6.61041 21.0475 6.61041 20.7465C6.61041 20.4465 6.85341 20.2025 7.15441 20.2025Z"
                      // Fill is set to current color to match the stroke
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="stroke-current stroke-[1.5] [stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-300 group-hover:stroke-[2] group-hover:[animation:draw_0.5s_ease-in_forwards]"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.4347 20.2025C18.7357 20.2025 18.9797 20.4465 18.9797 20.7465C18.9797 21.0475 18.7357 21.2915 18.4347 21.2915C18.1337 21.2915 17.8907 21.0475 17.8907 20.7465C17.8907 20.4465 18.1337 20.2025 18.4347 20.2025Z"
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={toggleMobileMenu}
                className="flex flex-col items-center justify-center w-8 h-8 space-y-1 text-[#333333] focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                ></span>
              </button>
            </div>
          </div>

          {/* Decorative Line for Mobile & Tablet */}
          <div className="relative mb-2 mt-2 px-4">
            <div className="relative w-full h-3 max-w-xs mx-auto">
              <LazyLoadImage
                className="w-full h-3 object-cover"
                alt="Decorative Line"
                src={lineImage}
                loading="lazy"
              />
              <div className="absolute w-3 h-3 top-0 left-1/2 transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-2 h-2 top-0.5 left-[calc(50%+12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-2 h-2 top-0.5 left-[calc(50%-12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%+24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%-24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-3 h-3 top-0 left-0 bg-secondaryColor rounded-full" />
              <div className="absolute w-3 h-3 top-0 right-0 bg-secondaryColor rounded-full" />
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className="transition-all duration-300 ease-in-out bg-white border-t border-gray-100 textHeading"
            // Use a viewport-based maxHeight when open and allow vertical scrolling so the menu never overflows the screen
            style={{
              maxHeight: isMobileMenuOpen ? 'calc(100vh - 180px)' : '0px',
              overflowY: isMobileMenuOpen ? 'auto' : 'hidden',
              opacity: isMobileMenuOpen ? 1 : 0,
              WebkitOverflowScrolling: isMobileMenuOpen ? 'touch' : undefined,
            }}
            aria-hidden={!isMobileMenuOpen}
          >
            <nav className="py-4 space-y-2">
              {NavItems.map((item) => (
                <Link key={item.link} to={item.link} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="link"
                    // Added 'group' here so the child element knows when the parent is hovered
                    className={`group w-full text-center font-secondaryFont font-normal py-2 px-4 transition-colors no-underline hover:no-underline 
      ${currentPath === item.link
                        ? "text-[#8b0000]"
                        : "text-[#333333] hover:text-[#8b0000]"
                      }`}
                  >
                    <div className="flex justify-center">
                      <span
                        className={`relative inline-block pb-1
          bg-gradient-to-r from-[#8b0000] to-[#8b0000] 
          bg-left-bottom bg-no-repeat 
          transition-[background-size] duration-300 ease-in-out
          ${currentPath === item.link
                            ? "bg-[length:100%_2px]" // Active state
                            : "bg-[length:0%_2px] group-hover:bg-[length:100%_2px]" // Hover state (triggered by group-hover)
                          }
        `}
                      >
                        {t(`nav.${item.name}`)}
                      </span>
                    </div>
                  </Button>
                </Link>
              ))}

              {/* User Profile Options (only shown when logged in) */}
              {isLoggedIn && (
                <>
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="link"
                      className="font-secondaryFont w-full text-center font-normal py-1.5 px-4 transition-colors text-[#00000080] hover:text-[#8b0000] text-sm"
                    >
                      {t("profile.personalProfile")}
                    </Button>
                  </Link>

                  <Link to="/puja-bookings" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="link"
                      className="font-secondaryFont w-full text-center font-normal py-1.5 px-4 transition-colors text-[#00000080] hover:text-[#8b0000] text-sm"
                    >
                      {t("profile.pujaBookings")}
                    </Button>
                  </Link>

                  <Link to="/prashad-order-history" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="link"
                      className="font-secondaryFont w-full text-center font-normal py-1.5 px-4 transition-colors text-[#00000080] hover:text-[#8b0000] text-sm"
                    >
                      {t("profile.prashadOrders")}
                    </Button>
                  </Link>

                  <Link to="/donations-history" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="link"
                      className="font-secondaryFont w-full text-center font-normal py-1.5 px-4 transition-colors text-[#00000080] hover:text-[#8b0000] text-sm"
                    >
                      {t("profile.donationsHistory")}
                    </Button>
                  </Link>

                  <Link to="/membership-history" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="link"
                      className="font-secondaryFont w-full text-center font-normal py-1.5 px-4 transition-colors text-[#00000080] hover:text-[#8b0000] text-sm"
                    >
                      {t("profile.membershipHistory")}
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Register/Login/Logout Button */}
              {!isLoggedIn ? (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="font-secondaryFont w-full bg-[#8b0000] hover:bg-[#660000] text-white py-2 textDescription font-normal mx-4">
                    {t("auth.register")}
                  </Button>
                </Link>
              ) : (
                <div className="px-4 pt-2">
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="font-secondaryFont w-full bg-[#8b0000] hover:bg-[#660000] text-white py-2 textDescription font-normal flex items-center justify-center gap-2"
                  >
                    <img src={LogoutIcon} alt="Logout" className="w-5 h-5 object-contain" />
                    <span>{t("auth.logout")}</span>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Cart modal removed; using /checkout route instead */}
    </header>
  );
};

export default Header;
