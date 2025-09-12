
import React, { Suspense } from "react";
import { BlogListingLoader, ComponentLoader } from "../../components/ui/LoadingComponents";
import BlogImageWebp from '@/assets/images/BlogImage.webp';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const Blogs = React.lazy(() => import("@/components/Blogs/Blogs"));

export const BlogPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section with Suspense */}
            <Suspense fallback={<ComponentLoader height="h-[60vh]" className="rounded-none" />}>
                <HeroSection
                    pageKey="blogs"
                    backgroundImage={BlogImageWebp}
                />
            </Suspense>

            {/* Blogs Section with Suspense */}
            <Suspense fallback={<BlogListingLoader />}>
                <Blogs />
            </Suspense>
        </>
    );
};
