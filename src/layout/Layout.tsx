import React from 'react';
import Header from '../components/common/Header';
import { Footer } from '../components/common/Footer';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
    return (
        <div className="bg-white flex flex-row justify-center w-full">
            <div className={`bg-white overflow-hidden ${className}`}>
                {/* Header Section */}
                <Header />
                
                {/* Main Content */}
                <main className="min-h-screen">
                    {children}
                </main>
                
                {/* Footer Section */}
                <Footer />
            </div>
        </div>
    );
};

export default Layout;