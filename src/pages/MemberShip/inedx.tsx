
import React, { Suspense } from "react";
import { SectionLoader, ComponentLoader, SubscriptionLoader } from "../../components/ui/LoadingComponents";
import membershipPng from '@/assets/images/membership.png';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const ScrollingBanner = React.lazy(() => import("../../components/home/ScrollingBanner"));
const ContactSection = React.lazy(() => import("../../components/home/ContactSection").then(module => ({ default: module.ContactSection })));
const BlogSection = React.lazy(() => import("../../components/home/BlogSection").then(module => ({ default: module.BlogSection })));
const SubscriptionPlans = React.lazy(() => import("@/components/memberShip/SubscriptionPlans"));

export const MemberShipPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <HeroSection
                    title="Subscription"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    backgroundImage={membershipPng}
                />
            </Suspense>

            {/* Subscription Plans Section */}
            <Suspense fallback={<SubscriptionLoader />}>
                <SubscriptionPlans />
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

            {/* Info Cards Section */}
            {/* <InfoCards /> */}
        </>
    );
};
