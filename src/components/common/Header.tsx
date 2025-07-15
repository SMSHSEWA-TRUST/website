import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "../ui/navigation-menu";

const Header = (): JSX.Element => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPujaSubmenuOpen, setIsPujaSubmenuOpen] = useState(false);
    const [isPujaDropdownOpen, setIsPujaDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const togglePujaSubmenu = () => {
        setIsPujaSubmenuOpen(!isPujaSubmenuOpen);
    };

    const togglePujaDropdown = () => {
        setIsPujaDropdownOpen(!isPujaDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsPujaDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
            {/* Main Header Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Layout */}
                <div className="hidden lg:flex lg:items-center lg:justify-between lg:py-4 xl:py-6">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img
                            className="w-24 h-24  object-cover"
                            alt="Temple Logo"
                            src="/temp-logo.png"
                        />
                    </div>

                    {/* Center Content - Title, Decorative Line, and Navigation */}
                    <div className="flex-1 flex flex-col items-center mx-8 xl:mx-12">
                        {/* Title */}
                        <h1 className="text-center mb-4 xl:mb-6 text-2xl xl:text-3xl 2xl:text-3xl font-normal text-[#4c291e] [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#8b0000] [font-family:'Marcellus_SC',Helvetica] leading-tight max-w-4xl">
                            Shree Mahakaleshwar Salasar Hanuman Sewa Trust
                        </h1>

                        {/* Decorative Line - Between Title and Navigation */}
                        <div className="relative mb-4 xl:mb-6">
                            <div className="relative w-full max-w-4xl h-3">
                                <img
                                    className="w-full h-3 object-cover"
                                    alt="Decorative Line"
                                    src="/line.png"
                                />
                                {/* Center dot - largest */}
                                <div className="absolute w-3 h-3 top-0 left-1/2 transform -translate-x-1/2 bg-[#d05e2d] rounded-full" />
                                {/* Medium dots near center */}
                                <div className="absolute w-2 h-2 top-0.5 left-1/2 transform -translate-x-1/2 translate-x-4 bg-[#d05e2d] rounded-full" />
                                <div className="absolute w-2 h-2 top-0.5 left-1/2 transform -translate-x-1/2 -translate-x-4 bg-[#d05e2d] rounded-full" />
                                {/* Small dots further from center */}
                                <div className="absolute w-1.5 h-1.5 top-1 left-1/2 transform -translate-x-1/2 translate-x-6 bg-[#d05e2d] rounded-full" />
                                <div className="absolute w-1.5 h-1.5 top-1 left-1/2 transform -translate-x-1/2 -translate-x-6 bg-[#d05e2d] rounded-full" />
                                {/* End dots - at both ends of the line */}
                                <div className="absolute w-3 h-3 top-0 left-0 bg-[#d05e2d] rounded-full" />
                                <div className="absolute w-3 h-3 top-0 right-0 bg-[#d05e2d] rounded-full" />
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <NavigationMenu>
                            <NavigationMenuList className="flex items-center gap-4 xl:gap-6 2xl:gap-8">
                                <NavigationMenuItem>
                                    <Button
                                        variant="link"
                                        className="text-[#333333] text-lg xl:text-xl [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] transition-colors"
                                    >
                                        Home
                                    </Button>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Button
                                        variant="link"
                                        className="text-[#333333] text-lg xl:text-xl [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] transition-colors"
                                    >
                                        About
                                    </Button>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={togglePujaDropdown}
                                            className="flex items-center gap-1 bg-transparent hover:bg-transparent text-[#333333] text-lg xl:text-xl [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] transition-colors px-3 py-2"
                                        >
                                            Puja&apos;s
                                            <svg
                                                className={`w-4 h-4 ml-1 transition-transform duration-200 ${isPujaDropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isPujaDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-1 w-[250px] bg-white shadow-lg border border-gray-100 rounded-md z-50">
                                                <div className="py-2">
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 transition-colors"
                                                        onClick={() => setIsPujaDropdownOpen(false)}
                                                    >
                                                        Hanuman Puja
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 transition-colors"
                                                        onClick={() => setIsPujaDropdownOpen(false)}
                                                    >
                                                        Mahakaleshwar Puja
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 transition-colors"
                                                        onClick={() => setIsPujaDropdownOpen(false)}
                                                    >
                                                        Aarti Services
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 transition-colors"
                                                        onClick={() => setIsPujaDropdownOpen(false)}
                                                    >
                                                        Special Prayers
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 transition-colors"
                                                        onClick={() => setIsPujaDropdownOpen(false)}
                                                    >
                                                        Festival Pujas
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 transition-colors"
                                                        onClick={() => setIsPujaDropdownOpen(false)}
                                                    >
                                                        Book a Puja
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Button
                                        variant="link"
                                        className="text-[#333333] text-lg xl:text-xl [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] transition-colors"
                                    >
                                        Membership
                                    </Button>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Button
                                        variant="link"
                                        className="text-[#333333] text-lg xl:text-xl [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] transition-colors"
                                    >
                                        Blogs
                                    </Button>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Button
                                        variant="link"
                                        className="text-[#333333] text-lg xl:text-xl [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] transition-colors"
                                    >
                                        Contact us
                                    </Button>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Register/Login Button */}
                    <div className="flex-shrink-0">
                        <Button className="bg-[#8b0000] hover:bg-[#660000] text-white px-4 xl:px-6 py-2 xl:py-3 text-sm xl:text-base [font-family:'Tenor_Sans',Helvetica] font-normal transition-colors">
                            Register/Login
                        </Button>
                    </div>
                </div>

                {/* Mobile & Tablet Layout */}
                <div className="lg:hidden">
                    {/* Mobile Header Bar with Title Centered */}
                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <img
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover"
                                alt="Temple Logo"
                                src="/temp-logo.png"
                            />
                        </div>

                        {/* Centered Title */}
                        <div className="flex-1 flex justify-center px-2 sm:px-4">
                            <h1 className="text-center text-[17px] font-normal text-[#4c291e] [text-shadow:0px_1px_1px_#daa52040] [-webkit-text-stroke:0.3px_#8b0000] [font-family:'Marcellus_SC',Helvetica] leading-tight max-w-xs sm:max-w-sm">
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
                                <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                            </button>
                        </div>
                    </div>



                    {/* Mobile Navigation Menu */}
                    <div className={`${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100`}>
                        <nav className={`py-4 space-y-2 ${isMobileMenuOpen ? 'max-h-80 overflow-y-auto' : ''}`}>
                            <Button
                                variant="link"
                                className="w-full text-center text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] py-2 px-4"
                            >
                                Home
                            </Button>
                            <Button
                                variant="link"
                                className="w-full text-center text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] py-2 px-4"
                            >
                                About
                            </Button>
                            <div className="w-full">
                                <button
                                    onClick={togglePujaSubmenu}
                                    className="w-full text-center text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] py-2 px-4 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <span>Puja&apos;s</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${isPujaSubmenuOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPujaSubmenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="bg-gray-50  border-[#8b0000] ml-4 mt-1 max-h-60 overflow-y-auto">
                                        <button className="w-full text-center text-[#333333] text-sm [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 py-2 px-4 transition-colors">
                                            Hanuman Puja
                                        </button>
                                        <button className="w-full text-center text-[#333333] text-sm [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 py-2 px-4 transition-colors">
                                            Mahakaleshwar Puja
                                        </button>
                                        
                                        <button className="w-full text-center text-[#333333] text-sm [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] hover:bg-orange-50 py-2 px-4 transition-colors">
                                            Book a Puja
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="link"
                                className="w-full text-center text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] py-2 px-4"
                            >
                                Membership
                            </Button>
                            <Button
                                variant="link"
                                className="w-full text-center text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] py-2 px-4"
                            >
                                Blogs
                            </Button>
                            <Button
                                variant="link"
                                className="w-full text-center text-[#333333] text-base [font-family:'Tenor_Sans',Helvetica] font-normal hover:text-[#8b0000] py-2 px-4"
                            >
                                Contact us
                            </Button>
                            {/* Mobile Register/Login in menu */}
                            <div className="px-4 pt-2">
                                <Button className="w-full bg-[#8b0000] hover:bg-[#660000] text-white py-2 text-sm [font-family:'Tenor_Sans',Helvetica] font-normal">
                                    Register/Login
                                </Button>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
