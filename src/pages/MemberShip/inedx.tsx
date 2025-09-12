
import React, { Suspense } from "react";
import { ComponentLoader, SubscriptionLoader } from "../../components/ui/LoadingComponents";
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
                    pageKey="membership"
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
