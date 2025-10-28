
import React, { Suspense } from "react";
import { SectionLoader, ComponentLoader } from "../../components/ui/LoadingComponents";
import pujaWebp from '@/assets/images/puja.webp';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));

const Puja = React.lazy(() => import("../../components/puja/Puja"));

export const PujaPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <HeroSection
                    pageKey="puja"
                    backgroundImage={pujaWebp}
                />
            </Suspense>

            {/* Pooja Section */}
            <div >
                <Suspense fallback={<SectionLoader />}>
                    <Puja />
                </Suspense>
            </div>






        </>
    );
};
