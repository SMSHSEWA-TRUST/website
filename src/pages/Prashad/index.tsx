import React, { Suspense } from "react";
import { SectionLoader } from "@/components/ui/LoadingComponents";
import prashadWebp from "@/assets/images/Prashad’s.webp";
import PrashadSection from "@/components/prashad/PrashadSection";
import { useI18n } from "@/lib/i18n";

const HeroSection = React.lazy(() => import("@/components/common/HeroSection"));

export const PrashadPage = (): JSX.Element => {
    const { t } = useI18n();
    const titles = t("parshadPage.title");
    const title1 = titles?.[0]?.title1 || "Shri Mahakaleshwar Prasad";
    const title2 = titles?.[0]?.title2 || "Shri Salasar Balaji Prasad";
    const title3 = titles?.[0]?.title3 || "Idols & Photo Frames";

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
                    title={title1}
                    useApiData={true}
                    categoryFilter="Shree Mahakaleshwar"
                />

                {/* Shri Salasar Balaji Prasad Section - Using API Data with Category Filter */}
                <PrashadSection
                    title={title2}
                    useApiData={true}
                    categoryFilter="Shree Salasar Balaji"
                    className="pt-4"
                />

                {/* Other Section (Idols & Photo Frames) - Using API Data with Category Filter */}
                <PrashadSection
                    title={title3}
                    useApiData={true}
                    categoryFilter="Other"
                    className="pt-4"
                />
            </div>
        </>
    );
};

export default PrashadPage;
