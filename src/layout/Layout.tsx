import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import WhatsAppButton from '../components/ui/WhatsAppButton';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
    const location = useLocation();


    // showing non-top sections.
    React.useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'auto' });
            }
        } catch (e) {
            // ignore
        }
    }, [location.pathname]);

    // Do not show header/footer on the signup, login, otp, profile pages and some booking/history pages
    // Note: donation pages should show the common header/footer, so '/donation' was removed from hidden patterns.
    const hiddenPaths = ['/signup', '/login', '/otp', '/family-details', '/personal-details', '/profile', '/membership-history', '/donations-history', '/prashad-order-history', '/puja-bookings', '/checkout', '/puja-booking', '/puja-booking-review', '/puja-booking-confirmation'];
    const hiddenPathPatterns: string[] = []; // no prefix patterns to hide

    const hideHeaderFooter = hiddenPaths.includes(location.pathname) ||
        hiddenPathPatterns.some(pattern => location.pathname.startsWith(pattern));

    return (
        <div className="bg-white flex flex-row justify-center w-full">
            {/* make inner wrapper full width so pages can span edge-to-edge */}
            <div className={`bg-white overflow-hidden w-full ${className}`}>
                {/* Header Section */}
                {!hideHeaderFooter && <Header />}

                {/* Main Content */}
                <main
                    className={`min-h-screen ${!hideHeaderFooter ? 'lg:mt-[200px] mt-[100px] md:mt-[120px]' : ''} ${className}`.trim()}
                >
                    {children}
                </main>

                {/* Footer Section */}
                {!hideHeaderFooter && <Footer />}
            </div>
            {/* WhatsApp floating button - visible on every page */}
            <WhatsAppButton />
        </div>
    );
};

export default Layout;