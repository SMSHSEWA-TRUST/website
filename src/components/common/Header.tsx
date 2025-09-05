import { useState, useEffect, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import tempLogo from "@/assets/images/temp-logo.png";
import lineImage from "@/assets/images/line.png";
import { useLocation, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "../ui/navigation-menu";

const Header = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const location = useLocation();
  const currentPath = location.pathname;
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

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
          // If scrolled down and past small threshold, hide header
          if (currentY > lastScrollY.current && currentY > 50) {
            setIsHidden(true);
          } else {
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
      {/* Top Red Bar */}
      <div className="bg-[#8b0000] text-white py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 lg:gap-10 textDescription">
              <span className="flex items-center gap-1 text">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 6.5C3 5.95 3.45 5.5 4 5.5H20C20.55 5.5 21 5.95 21 6.5V17.5C21 18.05 20.55 18.5 20 18.5H4C3.45 18.5 3 18.05 3 17.5V6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 6.5L12 12.5L3 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>support@smsh.com</span>
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M22 16.92V20a2 2 0 0 1-2.18 2A19.78 19.78 0 0 1 3 5.18 2 2 0 0 1 5 3h3.09a2 2 0 0 1 2 1.72c.12.9.37 1.77.74 2.58a2 2 0 0 1-.45 2.11L9.91 11.09a16 16 0 0 0 6 6l1.68-1.42a2 2 0 0 1 2.11-.45c.81.37 1.68.62 2.58.74a2 2 0 0 1 1.72 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>+91 9876543210</span>
              </span>
            </div>
            <div className="flex items-center gap-2 textDescription">
              <span>Language:</span>
              <select className="bg-transparent border border-white/30 rounded px-2 py-1 text-white">
                <option value="en" className="text-black">
                  English
                </option>
                <option value="hi" className="text-black">
                  हिंदी
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
                Shree Mahakaleshwar Salasar Hanuman Sewa Trust
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

            {/* Register/Login or Logout Button */}
            {isLoggedIn ? (
              <div className="flex-shrink-0">
                <Button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="font-secondaryFont bg-[#8b0000] hover:bg-[#660000] text-white px-4 py-2 textDescription font-normal"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex-shrink-0">
                <Link to="/login">
                  <Button className="font-secondaryFont bg-[#8b0000] hover:bg-[#660000] text-white px-4 py-2 textDescription font-normal">
                    Register/Login
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
                      Home
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
                      About
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
                      Puja's
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
                      Membership
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
                      Blogs
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
                      Contact us
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
        {/* Top Red Bar for Mobile */}
        <div className="bg-[#8b0000] text-white py-2">
          <div className="px-4 sm:px-6">
            <div className="flex flex-col gap-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-4 md:gap-16">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M3 6.5C3 5.95 3.45 5.5 4 5.5H20C20.55 5.5 21 5.95 21 6.5V17.5C21 18.05 20.55 18.5 20 18.5H4C3.45 18.5 3 18.05 3 17.5V6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 6.5L12 12.5L3 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>support@smsh.com</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M22 16.92V20a2 2 0 0 1-2.18 2A19.78 19.78 0 0 1 3 5.18 2 2 0 0 1 5 3h3.09a2 2 0 0 1 2 1.72c.12.9.37 1.77.74 2.58a2 2 0 0 1-.45 2.11L9.91 11.09a16 16 0 0 0 6 6l1.68-1.42a2 2 0 0 1 2.11-.45c.81.37 1.68.62 2.58.74a2 2 0 0 1 1.72 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>+91 9876543210</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Language:</span>
                  <select className="bg-[#AD2F16] border border-white/30 rounded px-1 py-0.5 text-white text-xs">
                    <option value="en" className="text-black">
                      English
                    </option>
                    <option value="hi" className="text-black">
                      हिंदी
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                Shree Mahakaleshwar Salasar Hanuman Sewa Trust
              </h1>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
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
            className={`${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 textHeading`}
          >
            <nav
              className={`py-4 space-y-2 ${isMobileMenuOpen ? "max-h-80 overflow-y-auto" : ""
                }`}
            >
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/"
                    ? "text-[#8b0000]"
                    : "text-[#333333] hover:text-[#8b0000]"
                    }`}
                >
                  Home
                </Button>
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/about"
                    ? "text-[#8b0000]"
                    : "text-[#333333] hover:text-[#8b0000]"
                    }`}
                >
                  About
                </Button>
              </Link>
              <Link to="/puja" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/puja"
                    ? "text-[#8b0000]"
                    : "text-[#333333] hover:text-[#8b0000]"
                    }`}
                >
                  Puja's
                </Button>
              </Link>
              <Link to="/membership" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/membership"
                    ? "text-[#8b0000]"
                    : "text-[#333333] hover:text-[#8b0000]"
                    }`}
                >
                  Membership
                </Button>
              </Link>
              <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/blogs"
                    ? "text-[#8b0000]"
                    : "text-[#333333] hover:text-[#8b0000]"
                    }`}
                >
                  Blogs
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="link"
                  className={`font-secondaryFont w-full text-center font-normal py-2 px-4 transition-colors ${currentPath === "/contact"
                    ? "text-[#8b0000]"
                    : "text-[#333333] hover:text-[#8b0000]"
                    }`}
                >
                  Contact us
                </Button>
              </Link>
              {/* Mobile Register/Login in menu */}
              {!isLoggedIn ? (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="font-secondaryFont w-full bg-[#8b0000] hover:bg-[#660000] text-white py-2 textDescription font-normal mx-4">
                    Register/Login
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="font-secondaryFont w-full bg-[#8b0000] hover:bg-[#660000] text-white py-2 textDescription font-normal mx-4"
                >
                  Logout
                </Button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
