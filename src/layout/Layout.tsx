import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import { Footer } from '../components/common/Footer';

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

    // Do not show header/footer on the signup, login and otp pages
    const hiddenPaths = ['/signup', '/login', '/otp', '/family-details', '/personal-details'];
    const hideHeaderFooter = hiddenPaths.includes(location.pathname);

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
        </div>
    );
};

export default Layout;