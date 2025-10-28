import React, { Suspense } from "react";
import { SectionLoader } from "@/components/ui/LoadingComponents";
import prashadWebp from "@/assets/images/Prashad’s.webp";
import PrashadSection from "@/components/prashad/PrashadSection";

const HeroSection = React.lazy(() => import("@/components/common/HeroSection"));

export const PrashadPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<SectionLoader />}>
                <HeroSection
                    pageKey="prashad"
                    backgroundImage={prashadWebp}
                />
            </Suspense>

            {/* Main Content with Background */}
            <div className="w-full  py-8 md:py-12">
                {/* Shri Mahakaleshwar Prasad Section - Using API Data with Category Filter */}
                <PrashadSection
                    title="Shri Mahakaleshwar Prasad"
                    useApiData={true}
                    categoryFilter="Shree Mahakaleshwar"
                />

                {/* Shri Salasar Balaji Prasad Section - Using API Data with Category Filter */}
                <PrashadSection
                    title="Shri Salasar Balaji Prasad"
                    useApiData={true}
                    categoryFilter="Shree Salasar Balaji"
                    className="pt-4"
                />

                {/* Other Section (Idols & Photo Frames) - Using API Data with Category Filter */}
                <PrashadSection
                    title="Idols & Photo Frames"
                    useApiData={true}
                    categoryFilter="Other"
                    className="pt-4"
                />
            </div>
        </>
    );
};

export default PrashadPage;
