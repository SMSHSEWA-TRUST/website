import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "../ui/navigation-menu";

const Header = (): JSX.Element => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="w-full flex justify-center">
            <header className="w-full bg-white sticky top-0 shadow-sm max-w-[891px]">
                {/* Main Header Container */}
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex lg:items-center lg:justify-center lg:py-2 gap-6">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <img
                                className="w-20 h-20 object-cover"
                                alt="Temple Logo"
                                src="/temp-logo.png"
                            />
                        </div>

                        
                     

                        {/* Center Content - Title, Decorative Line, and Navigation */}
                        <div className="flex flex-col items-center lg:gap-2">
                            {/* Title */}
                            <h1 className="text-center mb-2 text-[32px] font-normal text-[#4c291e] [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#8b0000] font-marcellus leading-tight max-w-4xl">
                                Shree Mahakaleshwar Salasar Hanuman Sewa Trust
                            </h1>

                            {/* Decorative Line - Between Title and Navigation */}
                            <div className="relative mb-2 mt-2">
                                <div className="relative w-full max-w-4xl h-3">
                                    <img
                                        className="w-full h-3 object-cover"
                                        alt="Decorative Line"
                                        src="/line.png"
                                    />
                                    {/* Center dot - largest */}
                                    <div className="absolute w-3 h-3 top-0 left-1/2 transform -translate-x-1/2 bg-[#d05e2d] rounded-full" />
                                    {/* Medium dots near center - repositioned to be equidistant from center */}
                                    <div className="absolute w-2 h-2 top-0.5 left-[calc(50%+12px)] transform -translate-x-1/2 bg-[#d05e2d] rounded-full" />
                                    <div className="absolute w-2 h-2 top-0.5 left-[calc(50%-12px)] transform -translate-x-1/2 bg-[#d05e2d] rounded-full" />
                                    {/* Small dots further from center */}
                                    <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%+24px)] transform -translate-x-1/2 bg-[#d05e2d] rounded-full" />
                                    <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%-24px)] transform -translate-x-1/2 bg-[#d05e2d] rounded-full" />
                                    {/* End dots - at both ends of the line */}
                                    <div className="absolute w-3 h-3 top-0 left-0 bg-[#d05e2d] rounded-full" />
                                    <div className="absolute w-3 h-3 top-0 right-0 bg-[#d05e2d] rounded-full" />
                                </div>
                            </div>

                            {/* Desktop Navigation */}
                            <NavigationMenu>
                                <NavigationMenuList className="flex items-center gap-4 xl:gap-6 2xl:gap-8 w-full justify-center">
                                    <NavigationMenuItem>
                                        <a href="/">
                                            <Button
                                                variant="link"
                                                className={`text-[20px] font-tenor-sans font-normal transition-colors ${currentPath === '/' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                            >
                                                Home
                                            </Button>
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a href="/about">
                                            <Button
                                                variant="link"
                                                className={`text-[20px] font-tenor-sans font-normal transition-colors ${currentPath === '/about' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                            >
                                                About
                                            </Button>
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a href="/puja">
                                            <Button
                                                variant="link"
                                                className={`text-[20px] font-tenor-sans font-normal transition-colors ${currentPath === '/puja' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                            >
                                                Puja's
                                            </Button>
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem className="mr-4">
                                        <a href="/membership">
                                            <Button
                                                variant="link"
                                                className={`text-[20px] font-tenor-sans font-normal transition-colors ${currentPath === '/membership' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                            >
                                                Membership
                                            </Button>
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a href="/blogs">
                                            <Button
                                                variant="link"
                                                className={`text-[20px] font-tenor-sans font-normal transition-colors ${currentPath === '/blogs' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                            >
                                                Blogs
                                            </Button>
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a href="/contact">
                                            <Button
                                                variant="link"
                                                className={`text-[20px] font-tenor-sans font-normal transition-colors ${currentPath === '/contact' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                            >
                                                Contact us
                                            </Button>
                                        </a>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                          


                        </div>

                        {/* Register/Login Button */}
                        <div className="flex-shrink-0">
                            <Button className="bg-[#8b0000] hover:bg-[#660000] text-white px-3 py-2 text-[13px] font-tenor-sans font-normal transition-colors">
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
                                <h1 className="text-center text-[17px] font-marcellus text-[#4c291e] [text-shadow:0px_1px_1px_#daa52040] [-webkit-text-stroke:0.3px_#8b0000] leading-tight max-w-xs sm:max-w-sm">
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
                                <a href="/">
                                    <Button
                                        variant="link"
                                        className={`w-full text-center text-[10px] font-tenor-sans font-normal py-2 px-4 transition-colors ${currentPath === '/' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                    >
                                        Home
                                    </Button>
                                </a>
                                <a href="/about">
                                    <Button
                                        variant="link"
                                        className={`w-full text-center text-[10px] font-tenor-sans font-normal py-2 px-4 transition-colors ${currentPath === '/about' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                    >
                                        About
                                    </Button>
                                </a>
                                <a href="/puja">
                                    <Button
                                        variant="link"
                                        className={`w-full text-center text-[10px] font-tenor-sans font-normal py-2 px-4 transition-colors ${currentPath === '/puja' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                    >
                                        Puja's
                                    </Button>
                                </a>
                                <a href="/membership">
                                    <Button
                                        variant="link"
                                        className={`w-full text-center text-[10px] font-tenor-sans font-normal py-2 px-4 transition-colors ${currentPath === '/membership' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                    >
                                        Membership
                                    </Button>
                                </a>
                                <a href="/blogs">
                                    <Button
                                        variant="link"
                                        className={`w-full text-center text-[10px] font-tenor-sans font-normal py-2 px-4 transition-colors ${currentPath === '/blogs' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                    >
                                        Blogs
                                    </Button>
                                </a>
                                <a href="/contact">
                                    <Button
                                        variant="link"
                                        className={`w-full text-center text-[10px] font-tenor-sans font-normal py-2 px-4 transition-colors ${currentPath === '/contact' ? 'text-[#8b0000]' : 'text-[#333333] hover:text-[#8b0000]'}`}
                                    >
                                        Contact us
                                    </Button>
                                </a>
                                {/* Mobile Register/Login in menu */}
                                <div className="px-4 pt-2">
                                    <Button className="w-full bg-[#8b0000] hover:bg-[#660000] text-white py-2 text-[10px] font-tenor-sans font-normal ">
                                        Register/Login
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
