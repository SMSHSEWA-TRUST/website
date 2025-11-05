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

  // derive user name from localStorage if available
  const userName = (() => {
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
  })();

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
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-3 z-50 border border-gray-100" role="menu">
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
                  )}
                </div>

                {/* Cart Icon */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="View cart"
                >
                  <svg className="w-6 h-6 text-[#8b0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
                <NavigationMenuItem>
                  <Link to="/">
                    <Button
                      variant="link"
                      className={`font-secondaryFont font-normal transition-colors ${currentPath === "/"
                        ? "text-white underline"
                        : "text-white/90 hover:text-white"
                        }`}
                    >
                      {t("nav.home")}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about">
                    <Button
                      variant="link"
                      className={`font-secondaryFont font-normal transition-colors ${currentPath === "/about"
                        ? "text-white underline"
                        : "text-white/90 hover:text-white"
                        }`}
                    >
                      {t("nav.about")}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/puja">
                    <Button
                      variant="link"
                      className={`font-secondaryFont font-normal transition-colors ${currentPath === "/puja"
                        ? "text-white underline"
                        : "text-white/90 hover:text-white"
                        }`}
                    >
                      {t("nav.puja")}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/gallery">
                    <Button
                      variant="link"
                      className={`font-secondaryFont font-normal transition-colors ${currentPath === "/gallery"
                        ? "text-white underline"
                        : "text-white/90 hover:text-white"
                        }`}
                    >
                      {t("nav.gallery")}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/prashad">
                    <Button
                      variant="link"
                      className={`font-secondaryFont font-normal transition-colors ${currentPath === "/prashad"
                        ? "text-white underline"
                        : "text-white/90 hover:text-white"
                        }`}
                    >
                      {t("nav.prashad")}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/membership">
                    <Button
                      variant="link"
                      className={`font-secondaryFont font-normal transition-colors ${currentPath === "/membership"
                        ? "text-white underline"
                        : "text-white/90 hover:text-white"
                        }`}
                    >
                      {t("nav.membership")}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/blogs">
                    <Button
                      variant="link"
                      className={`font-secondaryFont font-normal transition-colors ${currentPath === "/blogs"
                        ? "text-white underline"
                        : "text-white/90 hover:text-white"
                        }`}
                    >
                      {t("nav.blogs")}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact">
                    <Button
                      variant="link"
                      className={`font-secondaryFont font-normal transition-colors ${currentPath === "/contact"
                        ? "text-white underline"
                        : "text-white/90 hover:text-white"
                        }`}
                    >
                      {t("nav.contact")}
                    </Button>
                  </Link>
                </NavigationMenuItem>
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
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="View cart"
                >
                  <svg className="w-5 h-5 text-[#8b0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
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
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/"
                    ? "text-[#8b0000] underline"
                    : "text-[#333333] hover:text-[#8b0000] no-underline"
                    }`}
                >
                  {t("nav.home")}
                </Button>
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/about"
                    ? "text-[#8b0000] underline"
                    : "text-[#333333] hover:text-[#8b0000] no-underline"
                    }`}
                >
                  {t("nav.about")}
                </Button>
              </Link>
              <Link to="/puja" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/puja"
                    ? "text-[#8b0000] underline"
                    : "text-[#333333] hover:text-[#8b0000] no-underline"
                    }`}
                >
                  {t("nav.puja")}
                </Button>
              </Link>
              <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/gallery"
                    ? "text-[#8b0000] underline"
                    : "text-[#333333] hover:text-[#8b0000] no-underline"
                    }`}
                >
                  {t("nav.gallery")}
                </Button>
              </Link>
              <Link to="/prashad" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/prashad"
                    ? "text-[#8b0000] underline"
                    : "text-[#333333] hover:text-[#8b0000] no-underline"
                    }`}
                >
                  {t("nav.prashad")}
                </Button>
              </Link>
              <Link to="/membership" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/membership"
                    ? "text-[#8b0000] underline"
                    : "text-[#333333] hover:text-[#8b0000] no-underline"
                    }`}
                >
                  {t("nav.membership")}
                </Button>
              </Link>
              <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/blogs"
                    ? "text-[#8b0000] underline"
                    : "text-[#333333] hover:text-[#8b0000] no-underline"
                    }`}
                >
                  {t("nav.blogs")}
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/contact"
                    ? "text-[#8b0000] underline"
                    : "text-[#333333] hover:text-[#8b0000] no-underline"
                    }`}
                >
                  {t("nav.contact")}
                </Button>
              </Link>

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
