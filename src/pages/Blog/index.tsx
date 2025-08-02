import React, { Suspense } from "react";
import { BlogListingLoader, ComponentLoader } from "../../components/ui/LoadingComponents";

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const Blogs = React.lazy(() => import("@/components/Blogs/Blogs"));

export const BlogPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section with Suspense */}
            <Suspense fallback={<ComponentLoader height="h-[60vh]" className="rounded-none" />}>
                <HeroSection
                    title="Blogs "
                    backgroundImage="/BlogImage.webp"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
                />
            </Suspense>

            {/* Blogs Section with Suspense */}
            <Suspense fallback={<BlogListingLoader />}>
                <Blogs />
            </Suspense>
        </>
    );
};
