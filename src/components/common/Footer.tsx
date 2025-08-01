import React from 'react';

interface SocialLink {
    name: string;
    icon: string;
    url: string;
}

interface FooterLink {
    name: string;
    url: string;
}

interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
    const specialLinks: FooterLink[] = [
        { name: 'Link 1', url: '#' },
        { name: 'Link 2', url: '#' },
        { name: 'Link 3', url: '#' },
        { name: 'Link 4', url: '#' },
        { name: 'Link 5', url: '#' },
    ];

    const socialLinks: SocialLink[] = [
        { name: 'Facebook', icon: '/Facebook.png', url: '#' },
        { name: 'Twitter', icon: '/Twitter.png', url: '#' },
        { name: 'Instagram', icon: '/Instagram.png', url: '#' },
        { name: 'LinkedIn', icon: '/LinkedIn.png', url: '#' },
        { name: 'YouTube', icon: '/YouTube.png', url: '#' },
    ];

    const bottomLinks: FooterLink[] = [
        { name: 'Partnerships', url: '#' },
        { name: 'Temple Support', url: '#' },
        { name: 'Privacy Policy', url: '#' },
    ];

    return (
        <footer className={`bg-[#8b0000] text-white ${className}`}>
            <div className="w-full max-w-none">
                {/* Large Screen Layout (Desktop) */}
                <div className="hidden lg:block">
                    <div className="container mx-auto px-6 py-6">
                        {/* Main Grid: 3 Equal Columns */}
                        <div className="grid grid-cols-3 gap-8 mb-6">
                            {/* Left Column: Special Links */}
                            <div className="flex flex-col">
                                <div className="flex items-center mb-4">
                                    <h3 className="font-['Marcellus_SC'] text-lg text-white [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000]">
                                        Special Links
                                    </h3>
                                </div>
                                <nav className="flex flex-col space-y-3">
                                    {specialLinks.map((link, index) => (
                                        <div key={index} className="flex items-center">
                                            <a
                                                href={link.url}
                                                className="font-['Tenor_Sans'] text-sm text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded py-1"
                                                aria-label={`Navigate to ${link.name}`}
                                            >
                                                {link.name}
                                            </a>
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            {/* Center Column: Logo & Main Content */}
                            <div className="flex flex-col items-center text-center">
                                {/* Logo */}
                                <div className="flex justify-center items-center mb-3">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-1 bg-white rounded-full" />
                                        <img
                                            src="/temp-logo.png"
                                            alt="Shree Mahakaleshwar Salasar Hanuman Sewa Trust Logo"
                                            className="relative w-full h-full object-cover rounded-full"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                {/* Organization Title */}
                                <div className="flex flex-col items-center mb-3">
                                    <h1 className="font-['Marcellus_SC'] text-lg [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000] leading-tight">
                                        Shree Mahakaleshwar Salasar<br />Hanuman Sewa Trust
                                    </h1>
                                </div>

                                {/* Decorative Line */}
                                <div className="flex justify-center items-center mb-3">
                                    <img
                                        src="/footer-line.png"
                                        alt=""
                                        className="h-1.5 w-auto"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex justify-center mb-4">
                                    <p className="font-['Tenor_Sans'] text-sm max-w-sm leading-relaxed text-gray-100 text-center">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat.
                                    </p>
                                </div>

                                {/* Social Media Icons */}
                                <div className="flex justify-center items-center mb-4">
                                    <div className="flex items-center justify-center space-x-3">
                                        {socialLinks.map((social, index) => (
                                            <div key={index} className="flex items-center justify-center">
                                                <a
                                                    href={social.url}
                                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-[#8b0000] hover:bg-gray-100 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                                    aria-label={`Visit our ${social.name} page`}
                                                >
                                                    <img
                                                        src={social.icon}
                                                        alt={social.name}
                                                        className="w-4 h-4 object-contain"
                                                        loading="lazy"
                                                    />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Links - Horizontal Row */}
                                <div className="flex flex-row items-center justify-center">
                                    <div className="flex items-center space-x-4">
                                        {bottomLinks.map((link, index) => (
                                            <React.Fragment key={index}>
                                                {index > 0 && (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 bg-[#d05e2d] rounded-full flex-shrink-0" />
                                                    </div>
                                                )}
                                                <div className="flex items-center">
                                                    <a
                                                        href={link.url}
                                                        className="font-['Tenor_Sans'] text-sm text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded px-2 py-1 whitespace-nowrap"
                                                    >
                                                        {link.name}
                                                    </a>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Info */}
                            <div className="flex flex-col items-end text-right">
                                <div className="flex items-center justify-end mb-4">
                                    <h3 className="font-['Marcellus_SC'] text-lg text-white [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000]">
                                        Info
                                    </h3>
                                </div>
                                <div className="flex flex-col space-y-3 font-['Tenor_Sans'] text-sm">
                                    <div className="flex flex-col items-end space-y-1">
                                        <div className="flex items-center">
                                            <span className="text-gray-100">Email:</span>
                                        </div>
                                        <div className="flex items-center">
                                            <a
                                                href="mailto:info@support.com"
                                                className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                                            >
                                                info@support.com
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                        <div className="flex items-center">
                                            <span className="text-gray-100">Phone No:</span>
                                        </div>
                                        <div className="flex items-center">
                                            <a
                                                href="tel:+919876543210"
                                                className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                                            >
                                                9876543210
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <div className="flex items-center">
                                            <span className="text-gray-100">Address:</span>
                                        </div>
                                        <div className="flex items-end">
                                            <address className="not-italic leading-relaxed text-white text-right">
                                                1080 Brickell Ave,<br />
                                                Miami (Florida)<br />
                                                United States
                                            </address>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="flex flex-col items-center space-y-3">
                            {/* Decorative Line */}
                            <div className="w-full flex justify-center items-center">
                                <img
                                    src="/footer-line-2.png"
                                    alt=""
                                    className="h-2 w-full max-w-4xl object-contain"
                                    loading="lazy"
                                />
                            </div>

                            {/* Copyright Section */}
                            <div className="w-full flex justify-between items-center font-['Tenor_Sans'] text-sm">
                                <div className="flex items-center space-x-2">
                                    <span>Made with</span>
                                    <span className="text-xl">🧡</span>
                                    <span>by Nexteir Technologies Pvt. Ltd. in India</span>
                                    <div className="flex items-center ml-2">
                                        <img
                                            src="/india.png"
                                            alt="India Flag"
                                            className="w-6 h-4"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span>All Rights Reserved © 2025 |</span>
                                    <a
                                        href="#"
                                        className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                                    >
                                        Terms & Conditions
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small Screen Layout (Mobile/Tablet) */}
                <div className="block lg:hidden">
                    <div className="container mx-auto px-4 py-4">
                        {/* Compact Center Layout */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            {/* Logo */}
                            <div className="flex justify-center items-center">
                                <div className="relative w-12 h-12">
                                    <div className="absolute inset-0.5 bg-white rounded-full" />
                                    <img
                                        src="/temp-logo.png"
                                        alt="Shree Mahakaleshwar Salasar Hanuman Sewa Trust Logo"
                                        className="relative w-full h-full object-cover rounded-full"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Organization Title */}
                            <div className="flex flex-col items-center">
                                <h1 className="font-['Marcellus_SC'] text-base leading-tight [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000]">
                                    Shree Mahakaleshwar Salasar<br />Hanuman Sewa Trust
                                </h1>
                            </div>

                            {/* Description */}
                            <div className="flex justify-center">
                                <p className="font-['Tenor_Sans'] text-xs max-w-xs leading-relaxed text-gray-100 text-center">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                    aliquip ex ea commodo consequat.
                                </p>
                            </div>

                            {/* Social Media Icons */}
                            <div className="flex justify-center items-center">
                                <div className="flex items-center justify-center space-x-2">
                                    {socialLinks.map((social, index) => (
                                        <div key={index} className="flex items-center justify-center">
                                            <a
                                                href={social.url}
                                                className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-[#8b0000] hover:bg-gray-100 hover:scale-105 transition-all duration-200"
                                                aria-label={`Visit our ${social.name} page`}
                                            >
                                                <img
                                                    src={social.icon}
                                                    alt={social.name}
                                                    className="w-3 h-3 object-contain"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Two Column Grid for Links and Info */}
                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                {/* Left: Info */}
                                <div className="flex flex-col text-left">
                                    <div className="flex items-center mb-2">
                                        <h3 className="font-['Marcellus_SC'] text-sm [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000]">
                                            Info
                                        </h3>
                                    </div>
                                    <div className="flex flex-col space-y-2 font-['Tenor_Sans'] text-xs">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center">
                                                <span className="text-gray-100">Email:</span>
                                            </div>
                                            <div className="flex items-start">
                                                <a href="mailto:info@support.com" className="text-white hover:text-gray-200 transition-colors">
                                                    info@support.com
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center">
                                                <span className="text-gray-100">Phone No:</span>
                                            </div>
                                            <div className="flex items-start">
                                                <a href="tel:+919876543210" className="text-white hover:text-gray-200 transition-colors">
                                                    9876543210
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center">
                                                <span className="text-gray-100">Address:</span>
                                            </div>
                                            <div className="flex items-start">
                                                <address className="not-italic text-white text-xs leading-relaxed">
                                                    1080 Brickell Ave, Miami (Florida)<br />United States
                                                </address>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Special Links */}
                                <div className="flex flex-col text-right">
                                    <div className="flex items-center justify-end mb-2">
                                        <h3 className="font-['Marcellus_SC'] text-sm [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000]">
                                            Special Links
                                        </h3>
                                    </div>
                                    <nav className="flex flex-col space-y-2">
                                        {specialLinks.map((link, index) => (
                                            <div key={index} className="flex justify-end">
                                                <a
                                                    href={link.url}
                                                    className="font-['Tenor_Sans'] text-xs text-white hover:text-gray-200 transition-colors"
                                                >
                                                    {link.name}
                                                </a>
                                            </div>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Bottom Links */}
                            <div className="flex flex-wrap justify-center items-center space-x-1">
                                {bottomLinks.map((link, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && (
                                            <div className="flex items-center justify-center mx-2">
                                                <div className="w-2 h-2 bg-[#d05e2d] rounded-full" />
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <a
                                                href={link.url}
                                                className="font-['Tenor_Sans'] text-sm text-white hover:text-gray-200 transition-colors px-1"
                                            >
                                                {link.name}
                                            </a>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Copyright */}
                            <div className="flex flex-col items-center space-y-2 font-['Tenor_Sans'] text-xs">
                                <div className="flex items-center space-x-1">
                                    <span>Made with</span>
                                    <span className="text-sm">🧡</span>
                                    <span>by Nexteir Technologies Pvt. Ltd. in India</span>
                                    <div className="flex items-center ml-1">
                                        <img src="/india.png" alt="India Flag" className="w-4 h-3" loading="lazy" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span>All Rights Reserved © 2025 |</span>
                                    <a href="#" className="text-white hover:text-gray-200 transition-colors">
                                        Terms & Conditions
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}; 