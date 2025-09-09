
import React, { Suspense } from "react";
import {  ComponentLoader, SubscriptionLoader } from "../../components/ui/LoadingComponents";
import membershipPng from '@/assets/images/membership.png';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const Faq = React.lazy(() => import("@/components/memberShip/faq"));
const SubscriptionPlans = React.lazy(() => import("@/components/memberShip/SubscriptionPlans"));

export const MemberShipPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <HeroSection
                    title="Subscriptions "
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    backgroundImage={membershipPng}
                />
            </Suspense>

            {/* Subscription Plans Section */}
            <Suspense fallback={<SubscriptionLoader />}>
                <SubscriptionPlans />
            </Suspense>

            {/* FAQ Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <Faq />
            </Suspense>

             </>
    );
};
