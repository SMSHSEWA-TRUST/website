import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import facebookIcon from '@/assets/images/Facebook.png';
import twitterIcon from '@/assets/images/Twitter.png';
import instagramIcon from '@/assets/images/Instagram.png';
import linkedinIcon from '@/assets/images/LinkedIn.png';
import youtubeIcon from '@/assets/images/YouTube.png';
import tempLogo from '@/assets/images/temp-logo.png';
import indiaFlag from '@/assets/images/india.png';
import { useI18n } from '@/lib/i18n';

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
    const { t } = useI18n();
    const navigate = useNavigate();
    const location = useLocation();

    const specialLinks: FooterLink[] = [
        { name: t('footer.specialLinks.about'), url: '/about' },
        { name: t('footer.specialLinks.mission'), url: '/about#image-section' },
        { name: t('footer.specialLinks.donate'), url: '/donate' },
        { name: t('footer.specialLinks.gallery'), url: '/gallery' },
        { name: t('footer.specialLinks.contact'), url: '/contact' },
    ];

    const socialLinks: SocialLink[] = [
        { name: t('footer.social.facebook'), icon: facebookIcon, url: '#' },
        { name: t('footer.social.twitter'), icon: twitterIcon, url: '#' },
        { name: t('footer.social.instagram'), icon: instagramIcon, url: '#' },
        { name: t('footer.social.linkedin'), icon: linkedinIcon, url: '#' },
        { name: t('footer.social.youtube'), icon: youtubeIcon, url: '#' },
    ];

    const bottomLinks: FooterLink[] = [
        { name: t('footer.bottom.partnerships'), url: '#' },
        { name: t('footer.bottom.templeSupport'), url: '#' },
        { name: t('footer.bottom.privacy'), url: '#' },
    ];

    return (
        <footer className={`bg-[#8b0000] text-white ${className}`}>
            <div className="w-full max-w-none font-secondaryFont">
                {/* Large Screen Layout (Desktop) */}
                <div className="hidden md:block">
                    <div className="w-full px-20  py-6">
                        {/* Main Grid: 3 Equal Columns */}
                        <div className="grid grid-cols-[1fr_1.5fr_1.2fr] gap-8 mb-6">
                            {/* Left Column: Special Links */}
                            <div className="flex flex-col py-10">
                                <div className="flex items-center mb-4">
                                    <h3 className="font-primaryFont textHeading text-white">
                                        {t('footer.headings.specialLinks')}
                                    </h3>
                                </div>
                                <nav className="flex flex-col space-y-3">
                                    {specialLinks.map((link, index) => (
                                        <div key={index} className="flex items-center">
                                            { /* Special handling for donate and mission links: intercept click */}
                                            {link.url === '/donate' || link.url === '/mission' ? (
                                                <a
                                                    href={link.url}
                                                    onClick={async (e) => {
                                                        try {
                                                            e.preventDefault();
                                                            const targetId = link.url === '/donate' ? 'donations' : 'mission';
                                                            // If already on home page, try to scroll to target
                                                            if (location.pathname === '/' || location.pathname === '') {
                                                                try {
                                                                    // try using scroll helper which considers header height
                                                                    const mod = await import('@/lib/scrollUtils');
                                                                    const scrolled = mod.scrollToId(targetId);
                                                                    if (scrolled) return;
                                                                } catch (e) {
                                                                    // fallback
                                                                    const el = document.getElementById(targetId);
                                                                    if (el) {
                                                                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        return;
                                                                    }
                                                                }
                                                            }

                                                            // Otherwise navigate to home and set state asking for focus
                                                            navigate('/', { state: { focus: targetId } });
                                                        } catch (err) {
                                                            // fallback to normal navigation if anything goes wrong
                                                            window.location.href = link.url;
                                                        }
                                                    }}
                                                    className="font-secondaryFont textDescription text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded py-1"
                                                    aria-label={`Navigate to ${link.name}`}
                                                >
                                                    {link.name}
                                                </a>
                                            ) : (
                                                <a
                                                    href={link.url}
                                                    className="font-secondaryFont textDescription text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded py-1"
                                                    aria-label={`Navigate to ${link.name}`}
                                                >
                                                    {link.name}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            {/* Center Column: Logo & Main Content */}
                            <div className="flex flex-col items-center text-center w-full max-w-3xl mx-auto">
                                {/* Logo */}
                                <div className="flex justify-center items-center mb-3">
                                    <Link to="/" aria-label="Home" className="relative w-20 h-20">
                                        <div className="absolute inset-1 bg-white rounded-full" />
                                        <LazyLoadImage
                                            src={tempLogo}
                                            alt="Shree Mahakaleshwar Salasar Hanuman Sewa Trust Logo"
                                            className="relative w-full h-full object-cover rounded-full"
                                            loading="lazy"
                                        />
                                    </Link>
                                </div>

                                {/* Organization Title */}
                                <div className="flex flex-col items-center mb-3 ">
                                    <h1
                                        className="font-primaryFont textHeadingLg  text-center font-semibold"
                                        style={{
                                            color: "#fff",

                                            textShadow: "0px 4px 4px #d05e2d40",
                                            WebkitTextStroke: "1px #9a0000",

                                        }}
                                    >
                                        {t('header.title')}
                                    </h1>
                                </div>

                                {/* Decorative Line */}
                                <div className="flex items-center justify-center py-2 w-full">
                                    <div className="flex items-center w-full max-w-md">
                                        {/* Left arrow/diamond with connecting line */}
                                        <div className="flex items-center flex-1">
                                            <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        </div>

                                        {/* Center dots with continuous line: small-small-big-small-small */}
                                        <div className="flex items-center">
                                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        </div>

                                        {/* Right arrow/diamond with connecting line */}
                                        <div className="flex items-center flex-1">
                                            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                            <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        </div>
                                    </div>
                                </div>


                                {/* Description */}
                                <div className="flex justify-center mb-1">
                                    <p className="font-secondaryFont textDescription leading-relaxed text-gray-100 text-center">
                                        {t('footer.description.lead')}

                                    </p>

                                </div>
                                <div className="flex justify-center mb-4">
                                    <p className="font-secondaryFont textDescription leading-relaxed text-gray-100 text-center">
                                        {t('footer.description.sub')}

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
                                                    aria-label={t('footer.aria.visitSocial',) + ` ${social.name}`}
                                                >
                                                    <LazyLoadImage
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
                                                        <div className="w-2.5 h-2.5 bg-secondaryColor rounded-full flex-shrink-0" />
                                                    </div>
                                                )}
                                                <div className="flex items-center">
                                                    <a
                                                        href={link.url}
                                                        className="font-secondaryFont textDescription text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded px-2 py-1 whitespace-nowrap"
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
                            <div className="flex flex-col items-end text-right py-10">
                                <div className="flex items-center justify-end mb-4">
                                    <h3 className="font-primaryFont textHeadingLg text-white">
                                        {t('footer.headings.info')}
                                    </h3>
                                </div>
                                <div className="flex flex-col space-y-3 font-secondaryFont textDescription">
                                    <div className="flex flex-col items-end space-y-1">
                                        <div className="flex items-center">
                                            <span className="font-secondaryFont text-gray-100">{t('footer.labels.email')}:{t('header.supportEmail')}</span>
                                        </div>
                                        {/* <div className="flex items-center">
                                            <a
                                                href="mailto:info@support.com"
                                                className="font-secondaryFont text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                                            >
                                                info@support.com
                                            </a>
                                        </div> */}
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                        <div className="flex items-center">
                                            <span className="font-secondaryFont textDescription  text-gray-100">{t('footer.labels.phone')}: {t('header.phone')}</span>
                                        </div>
                                        {/* <div className="flex items-center">
                                            <a
                                                href="tel:+919352815982"
                                                className="font-secondaryFont text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                                            >
                                                9352815982
                                            </a>
                                        </div> */}
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <div className="flex items-center">
                                            <span className="font-secondaryFont textDescription  text-gray-100">{t('footer.labels.addressPrefix')} {t('footer.contact.address1')}</span>
                                        </div>

                                        <div className="flex items-end">
                                            <address className="font-secondaryFont textDescription  not-italic leading-relaxed text-white text-right">
                                                {t('footer.contact.address2')}
                                            </address>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="flex flex-col items-center space-y-3">
                            {/* Decorative Line */}
                            <div className="flex items-center justify-center py-2 w-full">
                                <div className="flex items-center w-full">
                                    {/* Left arrow/diamond with connecting line */}
                                    <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                    <div className="flex-1 h-0.5 " style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                    {/* Right arrow/diamond with connecting line */}
                                    <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                </div>
                            </div>


                            {/* Copyright Section */}
                            <div className="w-full flex justify-between items-center font-secondaryFont textDescription ">
                                <div className="flex items-center space-x-2">
                                    <span>Made with</span>
                                    <span className="textDescription ">🧡</span>
                                    <span>by Nexteir Technologies Pvt. Ltd. in India</span>
                                    <div className="flex items-center ml-2">
                                        <LazyLoadImage
                                            src={indiaFlag}
                                            alt="India Flag"
                                            className="w-6 h-4"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                <div className="flex textDescription  items-center space-x-1">
                                    <span>All Rights Reserved © 2025 |</span>
                                    <a
                                        href="#"
                                        className="font-secondaryFont text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                                    >
                                        Terms & Conditions
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small Screen Layout (Mobile/Tablet) */}
                <div className="block md:hidden">
                    <div className="w-full px-4 py-4">
                        {/* Compact Center Layout */}
                        <div className="flex flex-col items-center text-center space-y-4">

                            {/* Logo */}
                            <div className="flex justify-center items-center">
                                <Link to="/" aria-label="Home" className="relative w-16 h-16">
                                    <div className="absolute inset-1 bg-white rounded-full" />
                                    <LazyLoadImage
                                        src={tempLogo}
                                        alt="Shree Mahakaleshwar Salasar Hanuman Sewa Trust Logo"
                                        className="relative w-full h-full object-cover rounded-full"
                                        loading="lazy"
                                    />
                                </Link>
                            </div>

                            {/* Organization Title */}
                            <div className="flex flex-col items-center">
                                <h1 className="font-primaryFont textHeadingLg font-normal text-center"
                                    style={{
                                        color: "#fff",

                                    }}>
                                    Shree Mahakaleshwar Salasar<br />Hanuman Sewa Trust
                                </h1>
                            </div>

                            {/* Decorative Line (same as desktop, with arrows and dots) */}
                            <div className="flex items-center justify-center py-2 w-full">
                                <div className="flex items-center w-full max-w-md">
                                    {/* Left arrow/diamond with connecting line */}
                                    <div className="flex items-center flex-1">
                                        <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                    </div>

                                    {/* Center dots with continuous line: small-small-big-small-small */}
                                    <div className="flex items-center">
                                        <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-1.5 h-1.5 rounded-full border-2" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)', borderColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                    </div>

                                    {/* Right arrow/diamond with connecting line */}
                                    <div className="flex items-center flex-1">
                                        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                        <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex justify-center">
                                    <p className="font-secondaryFont textDescription max-w-xs leading-relaxed text-gray-100 text-center">
                                        Serving with Faith, Building with Seva
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <p className="font-secondaryFont textDescription max-w-xs leading-relaxed text-gray-100 text-center">
                                        A spiritual movement dedicated to devotion, culture, and service. Join us in creating the grand Mahadham in Surat by 2029.
                                    </p>
                                </div>
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
                                                <LazyLoadImage
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
                                        <h3 className="font-primaryFont textHeading">
                                            {t('footer.headings.info')}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex items-center gap-1">
                                            <span className="font-secondaryFont textDescription text-gray-100">{t('footer.labels.email')}:</span>
                                            <a href={`mailto:${t('header.supportEmail')}`} className="font-secondaryFont text-white hover:text-gray-200 transition-colors">
                                                {t('header.supportEmail')}
                                            </a>

                                        </div>

                                        <div className="flex items-center gap-1">
                                            <span className="font-secondaryFont textDescription text-gray-100">{t('footer.labels.phone')}:</span>
                                            <a href={`tel:${t('header.phone')}`} className="font-secondaryFont textDescription text-white hover:text-gray-200 transition-colors"> {t('header.phone')}</a>

                                        </div>
                                        <div className="flex  gap-1">
                                            <span className="font-secondaryFont textDescription text-gray-100">Address:</span>
                                            <div className="font-secondaryFont not-italic text-white textDescription leading-relaxed">
                                                {t('footer.contact.address1')}
                                                <br />
                                                {t('footer.contact.address2')}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Right: Special Links */}
                                <div className="flex flex-col text-right">
                                    <div className="flex items-center justify-end mb-2">
                                        <h3 className="font-primaryFont textHeading">
                                            {t('footer.headings.specialLinks')}
                                        </h3>
                                    </div>
                                    <nav className="flex flex-col space-y-2">
                                        {specialLinks.map((link, index) => (
                                            <div key={index} className="flex justify-end">
                                                {(link.url === '/donate' || link.url === '/mission') ? (
                                                    <a
                                                        href={link.url}
                                                        onClick={async (e) => {
                                                            try {
                                                                e.preventDefault();
                                                                const targetId = link.url === '/donate' ? 'donations' : 'mission';
                                                                if (location.pathname === '/' || location.pathname === '') {
                                                                    try {
                                                                        const mod = await import('@/lib/scrollUtils');
                                                                        const scrolled = mod.scrollToId(targetId);
                                                                        if (scrolled) return;
                                                                    } catch (err) {
                                                                        const el = document.getElementById(targetId);
                                                                        if (el) {
                                                                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                            return;
                                                                        }
                                                                    }
                                                                }
                                                                navigate('/', { state: { focus: targetId } });
                                                            } catch (err) {
                                                                window.location.href = link.url;
                                                            }
                                                        }}
                                                        className="font-secondaryFont textDescription text-white hover:text-gray-200 transition-colors"
                                                    >
                                                        {link.name}
                                                    </a>
                                                ) : (
                                                    <a
                                                        href={link.url}
                                                        className="font-secondaryFont textDescription text-white hover:text-gray-200 transition-colors"
                                                    >
                                                        {link.name}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </nav>
                                </div>
                            </div>



                            {/* Bottom Links */}
                            <div className="flex flex-wrap justify-center items-center space-x-1 font-secondaryFont">
                                {bottomLinks.map((link, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && (
                                            <div className="flex items-center justify-center mx-2">
                                                <div className="w-2 h-2 bg-secondaryColor rounded-full" />
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <a
                                                href={link.url}
                                                className="font-secondaryFont textDescription text-white hover:text-gray-200 transition-colors px-1"
                                            >
                                                {link.name}
                                            </a>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Decorative Line (simple, same as desktop bottom section) */}
                            <div className="flex items-center justify-center py-2 w-full">
                                <div className="flex items-center w-full">
                                    {/* Left arrow/diamond with connecting line */}
                                    <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                    <div className="flex-1 h-0.5 " style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                    {/* Right arrow/diamond with connecting line */}
                                    <div className="w-2 h-2 transform rotate-45" style={{ backgroundColor: 'rgba(217, 67, 3, 0.75)' }}></div>
                                </div>
                            </div>





                            {/* Copyright */}
                            <div className="flex flex-col items-center space-y-2 font-secondaryFont textDescription ">

                                <div className="flex items-center space-x-1">
                                    <span>Made with</span>
                                    <span className="text-sm">🧡</span>
                                    <span>by Nexteir Technologies Pvt. Ltd. in India</span>
                                    <div className="flex items-center ml-1">
                                        <LazyLoadImage src={indiaFlag} alt="India Flag" className="w-4 h-3" loading="lazy" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span>All Rights Reserved © 2025 |</span>
                                    <a href="#" className="font-secondaryFont text-white hover:text-gray-200 transition-colors">
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