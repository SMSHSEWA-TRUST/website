import React, { Suspense } from "react";
import { ComponentLoader, SectionLoader, ServicesLoader, BlogListingLoader } from "../../components/ui/LoadingComponents";
// Production-level image import
import aboutImage from "@/assets/images/About.webp";

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const AboutWorship = React.lazy(() => import("@/components/about/AboutWorship"));
const ImageSection = React.lazy(() => import("@/components/about/ImageSection"));
const OmNamehShivaya = React.lazy(() => import("../../components/home/OmNamehShivaya"));
const ScrollingBanner = React.lazy(() => import("../../components/home/ScrollingBanner"));
const ContactSection = React.lazy(() => import("../../components/home/ContactSection").then(module => ({ default: module.ContactSection })));
const BlogSection = React.lazy(() => import("../../components/home/BlogSection").then(module => ({ default: module.BlogSection })));
// const ArtiSection = React.lazy(() => import("@/components/about/ArtiSection"));
const TeamSection = React.lazy(() => import("@/components/about/Team"));
// const WordsTrustees = React.lazy(() => import("@/components/about/WordsTrustees"));
const CarouselContent = React.lazy(() => import("@/components/home/CarouselContent"));
export const AboutPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section with Suspense */}
            <Suspense fallback={<ComponentLoader height="h-[60vh]" className="rounded-none" />}>
                <HeroSection
                    pageKey="about"
                    // backgroundImage passed from page imports to ensure images are bundled correctly
                    backgroundImage={aboutImage}
                />
            </Suspense>

            {/* About Worship Section */}
            <Suspense fallback={<SectionLoader />}>
                <AboutWorship />
            </Suspense>



            {/* Image Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <ImageSection />
            </Suspense>

            {/* Carousel (test from BhudaanSection) */}
            <Suspense fallback={<SectionLoader />}>
                <CarouselContent />
            </Suspense>

            {/* Arti Section */}
            {/* <Suspense fallback={<SectionLoader />}>
                <ArtiSection />
            </Suspense> */}

            {/* Team Section */}
            <Suspense fallback={<SectionLoader />}>
                <TeamSection />
            </Suspense>

            {/* Om Namah Shivaya Section */}
            <Suspense fallback={<ComponentLoader height="h-64" />}>
                <OmNamehShivaya />
            </Suspense>

            {/* Scrolling Banner */}
            <Suspense fallback={<ComponentLoader height="h-32" />}>
                <ScrollingBanner />
            </Suspense>

            {/* Contact Section */}
            <Suspense fallback={<ServicesLoader />}>
                <ContactSection />
            </Suspense>

            {/* Blog Articles Section */}
            <Suspense fallback={<BlogListingLoader />}>

                <BlogSection />
            </Suspense>
        </>
    );
};