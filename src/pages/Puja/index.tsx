
import React, { Suspense } from "react";
import { SectionLoader, ComponentLoader } from "../../components/ui/LoadingComponents";
import pujaWebp from '@/assets/images/puja.webp';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const ScrollingBanner = React.lazy(() => import("../../components/home/ScrollingBanner"));
const ContactSection = React.lazy(() => import("../../components/home/ContactSection").then(module => ({ default: module.ContactSection })));
const BlogSection = React.lazy(() => import("../../components/home/BlogSection").then(module => ({ default: module.BlogSection })));
const Puja = React.lazy(() => import("../../components/puja/Puja"));

export const PujaPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <HeroSection
                    title="Puja'S"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    backgroundImage={pujaWebp}
                />
            </Suspense>

            {/* Puja Section */}
            <div className="mb-10 lg:mb-[200px]">
                <Suspense fallback={<SectionLoader />}>
                    <Puja />
                </Suspense>
            </div>

            {/* Scrolling Banner */}
            <Suspense fallback={<ComponentLoader height="h-16" />}>
                <ScrollingBanner />
            </Suspense>

            {/* Contact Section */}
            <Suspense fallback={<SectionLoader />}>
                <ContactSection />
            </Suspense>

            {/* Blog Articles Section */}
            <Suspense fallback={<SectionLoader />}>
                <BlogSection />
            </Suspense>
        </>
    );
};
