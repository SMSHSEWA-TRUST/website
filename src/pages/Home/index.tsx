import React, { Suspense } from "react";
import { SectionLoader, ComponentLoader, LiveDarshanLoader, ServicesLoader } from "../../components/ui/LoadingComponents";

// Lazy load components
const Hero = React.lazy(() => import("../../components/home/Hero"));
const About = React.lazy(() => import("../../components/home/About"));
const Services = React.lazy(() => import("../../components/home/Services"));
const LiveDarshan = React.lazy(() => import("../../components/home/LiveDarshan"));
const DivinePower = React.lazy(() => import("../../components/home/DivinePower"));
const ContactCards = React.lazy(() => import("../../components/home/ContactCards"));
const DonationSection = React.lazy(() => import("../../components/home/DonationSection"));
const GridLayout = React.lazy(() => import("../../components/home/GridLayout"));
const OmNamehShivaya = React.lazy(() => import("../../components/home/OmNamehShivaya"));
const ScrollingBanner = React.lazy(() => import("../../components/home/ScrollingBanner"));
const ContactSection = React.lazy(() => import("../../components/home/ContactSection").then(module => ({ default: module.ContactSection })));
const BlogSection = React.lazy(() => import("../../components/home/BlogSection").then(module => ({ default: module.BlogSection })));
const BhudaanSection = React.lazy(() => import("@/components/home/BhudaanSection"));

export const HomePage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-screen" />}>
                <Hero />
            </Suspense>

            {/* Bhudaan Section */}
            <Suspense fallback={<SectionLoader />}>
                <BhudaanSection />
            </Suspense>

            {/* About Section */}
            <Suspense fallback={<SectionLoader />}>
                <About />
            </Suspense>

            {/* Live Darshan Section */}
            <Suspense fallback={<LiveDarshanLoader />}>
                <LiveDarshan />
            </Suspense>

            {/* Services Section */}
            <Suspense fallback={<ServicesLoader />}>
                <Services />
            </Suspense>

            {/* Divine Power Section */}
            <Suspense fallback={<SectionLoader />}>
                <DivinePower />
            </Suspense>

            {/* Contact Cards Section */}
            <Suspense fallback={<SectionLoader />}>
                <ContactCards />
            </Suspense>

            {/* Donation Section */}
            <Suspense fallback={<SectionLoader />}>
                <DonationSection />
            </Suspense>

            {/* Grid Layout Section */}
            <Suspense fallback={<SectionLoader />}>
                <GridLayout />
            </Suspense>

            {/* Om Namah Shivaya Section */}
            <Suspense fallback={<SectionLoader />}>
                <OmNamehShivaya />
            </Suspense>

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