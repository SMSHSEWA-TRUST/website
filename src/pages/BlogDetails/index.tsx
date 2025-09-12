import React, { Suspense } from "react";
import { ComponentLoader, BlogDetailsLoader } from "../../components/ui/LoadingComponents";
import BlogdetailWebp from '@/assets/images/Blogdetail.webp';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const BlogDetails = React.lazy(() => import("@/components/Blogs/BlogDetails"));
export const BlogDetailsPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <HeroSection
                    pageKey="blogDetails"
                    // semiTitle will be taken from translations if present; prop acts as fallback
                    semiTitle="Blog By: John Doe | Date: 01/01/2025"
                    backgroundImage={BlogdetailWebp}
                />
            </Suspense>

            {/* Blog Details Section */}
            <Suspense fallback={<BlogDetailsLoader />}>
                <BlogDetails />
            </Suspense>
        </>
    );
};