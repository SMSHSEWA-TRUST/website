
import React, { Suspense } from "react";
import { SectionLoader, ComponentLoader } from "../../components/ui/LoadingComponents";
import pujaWebp from '@/assets/images/puja.webp';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
// const ScrollingBanner = React.lazy(() => import("../../components/home/ScrollingBanner"));
// const ContactSection = React.lazy(() => import("../../components/home/ContactSection").then(module => ({ default: module.ContactSection })));
// const BlogSection = React.lazy(() => import("../../components/home/BlogSection").then(module => ({ default: module.BlogSection })));
// const Puja = React.lazy(() => import("../../components/puja/Puja"));
// const Vedio = React.lazy(() => import("../../components/puja/Vedio"));
const Gallery = React.lazy(() => import("../../components/gallery/Gallery"));
export const GalleryPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <HeroSection
                    pageKey="gallery"
                    backgroundImage={pujaWebp}
                />
            </Suspense>

            {/* Puja Section */}
            {/* <div >
                <Suspense fallback={<SectionLoader />}>
                    <Puja />
                </Suspense>
            </div> */}

            {/* Gallery Section */}
            <Suspense fallback={<SectionLoader />}>
                <Gallery

                />
            </Suspense>

            {/* <Suspense fallback={<SectionLoader />}>
                <Vedio />
            </Suspense> */}

            {/* Scrolling Banner */}
            {/* <Suspense fallback={<ComponentLoader height="h-16" />}>
                <ScrollingBanner />
            </Suspense> */}

            {/* Contact Section */}
            {/* <Suspense fallback={<SectionLoader />}>
                <ContactSection />
            </Suspense> */}

            {/* Blog Articles Section */}
            {/* <Suspense fallback={<SectionLoader />}>
                <BlogSection />
            </Suspense> */}
        </>
    );
};
