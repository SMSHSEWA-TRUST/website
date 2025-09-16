import React, { Suspense } from "react";
import { ComponentLoader, BlogDetailsLoader } from "../../components/ui/LoadingComponents";
import BlogdetailWebp from '@/assets/images/Blogdetail.webp';
import { useParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const BlogDetails = React.lazy(() => import("@/components/Blogs/BlogDetails"));

export const BlogDetailsPage = (): JSX.Element => {

    const { t } = useI18n();
    const params = useParams();
    const id = params.id;

    // read translated blog list and pick entry by id
    const raw = t('BlogDetailsPage.Blog');
    const blogs = Array.isArray(raw) ? raw as Array<{ title?: string; subtitle?: string; content?: string[] }> : [];
    const idx = id ? Number(id) - 1 : 0;
    const selected = blogs[idx] || blogs[0] || null;

    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                <HeroSection
                    title={selected?.title ?? (t('BlogDetailsPage.title') as string)}
                    // subtitle for this blog (author/date) — fallback to page-level semiTitle
                    semiTitle={selected?.subtitle ?? (t('pageHero.blogDetails.semiTitle') as string) ?? (t('BlogDetailsPage.semiTitle') as string)}
                    backgroundImage={BlogdetailWebp}
                />
            </Suspense>

            {/* Blog Details Section */}
            <Suspense fallback={<BlogDetailsLoader />}>
                <BlogDetails id={id} />
            </Suspense>
        </>
    );
};